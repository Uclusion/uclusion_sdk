export function FetchClient(passedConfig){

    let configuration = Object.assign({}, passedConfig);

    /**
     * See https://developers.google.com/web/updates/2017/09/abortable-fetch
     * Without a timeout the versions promise chain can hang and in general bad things
     * @param opts
     * @returns {{signal: AbortSignal}}
     */
    function createAbort(opts) {
        const controller = new AbortController();
        // Backend gives you 20s for a long operation
        setTimeout(() => controller.abort(), 30000);
        return { ...opts, signal: controller.signal};
    }

    /**
     * Function that retries a call exactly once if
     * either the response code is not OK, or
     * if the result is catch block
     */
    let retryingFetch = (url, opts) => {
        const opStart = new Date();
        return fetch(url, createAbort(opts))
            .then((response) => {
                    const now = new Date();
                    if (!response.ok) {
                        // are we 500 series?
                        const is5xx = response.status >= 500 && response.status < 600
                        const responseMillis = now.getTime() - opStart.getTime();
                        const probablyTimeout = responseMillis >= 3000; // a 3 second 5xx is likely a backend timeout
                        // backend timeouts can be retried as problem may be lambda "warm up" that has now happened
                        // A 404 can be the result of an inconsistent read on DynamoDB so need to retry as well
                        const retryable = (is5xx && probablyTimeout) || (response.status === 404);
                        if (retryable) {
                            // retry _once_ more only
                            return fetch(url, createAbort(opts));
                        }
                    }
                    if (response.status === 208) {
                        // The API gateway has contacted a Lambda for us more than once with the same request ID
                        // This response won't have the data we are looking for so upstream should
                        // refresh versions and throw error but not in a user visible way as chances are very
                        // high that the first Lambda processed the post or patch already and we don't want resubmit
                        throw response;
                    }
                    return response;
                }
            ).catch((error) => {
                // This could be a network error or permissions or anything
                console.warn('There has been a problem with your fetch operation:', error);
                // Since the error was inside the fetch let's give it another try
                return fetch(url, createAbort(opts));
            });
    };


    let responseHandler = (response) => {
        if (!response.ok) {
            throw response; //give the response to upstream code
        }
        if (isJson(response)) {
            //massage things to be same standard as other clients
            let json = response.json().then((json) => {
                return {status: response.status, data: json}
            });
            return json;
        }
        if (passedConfig.responseAsBlob) {
            return response.blob().then((blob) => {
                return {status: response.status, blob};
            });
        }
        //todo make sure it's actually text
        return response.text().then((text) => {
            return {status: response.status, body: text}
        });
    };


    const defaultHeaders = {
        'Content-Type': 'application/json;charset=UTF-8',
        // If use these then need to do CORs pre-flight and anyway api gateway should not cache
        // 'Pragma': 'no-cache',
        // 'Cache-Control': 'no-cache, no-store, must-revalidate',
        // 'Expires': '0',
        'Accept' : 'application/json, text/plain, */*'
    };

    let actualHeaders = Object.assign({}, defaultHeaders, configuration.headers);
    configuration.headers = actualHeaders;

        let isJson = (response) => {
            for (var pair of response.headers.entries()){
                let key = pair[0];
                let value = pair[1];
                if (key.toLowerCase() === 'content-type' && value.toLowerCase().indexOf('json') != -1) {
                    return true;
                }
            }
            return false;
        };

    let defaultDomainMunger = (url, subdomain) => {
        if(subdomain){
            let oldHostname = url.hostname;
            const newHostname = subdomain + '.' + oldHostname;
            url.hostname = newHostname;
        }
        return url;
    };


    let urlConstructor = (subdomain, path, queryParams) => {
        let url = new URL(configuration.baseURL + '/' + path);
        //change the url to the subdomain to enable our endpoint endpoint stuff
        if(configuration.domainMunger){
            url = configuration.domainMunger(url, subdomain);
        }else{
            url = defaultDomainMunger(url, subdomain);
        }
        let search = url.searchParams;
        for(var key in queryParams){
            let value = queryParams[key];
            if(Array.isArray(value)){
                for(var index in value){
                    search.append(key, value[index])
                }
            }else {
                search.append(key, value);
            }
        }
        url.search = search.toString();
        //console.log(url);
        return url;
    };

    let headersConstructor = (headers) => {
        return Promise.resolve(Object.assign({}, headers))
            .then((newHeaders) => {
                if (configuration.tokenManager){
                    return configuration.tokenManager.getToken()
                        .then((token) => {
                            return {...newHeaders, Authorization: token }
                        });
                }
                return newHeaders;
            });
    };

    /**
     * Syntactic sugar over fetch get
     * @param subdomain the subdomain of the api we're calling
     * @param path the path relative to the base url
     * @param queryParams a query params object representing the query portion of the url
     * @returns a promise which will resolve to the result of the get call
     */
    this.doGet = function (subdomain, path, queryParams) {
        const url = urlConstructor(subdomain, path, queryParams);
        return headersConstructor(configuration.headers)
            .then(headers => {
                // console.log(headers);
                const opts = {method: 'GET', headers, mode: configuration.mode};
                return retryingFetch(url, opts).then(responseHandler)
            });
    };

    /**
     * Syntactic sugar over fetch delete
     * @param subdomain the subdomain of the api we're calling
     * @param path the path relative to the base url
     * @param queryParams a query params object representing the query portion of the url
     * @returns a promise which will resolve to the result of the DELETE call
     */
    this.doDelete = function(subdomain, path, queryParams) {
        const url = urlConstructor(subdomain, path, queryParams);
        return headersConstructor(configuration.headers)
            .then(headers => {
                const opts = {method: 'DELETE', headers, mode: configuration.mode};
                return retryingFetch(url, opts).then(responseHandler)
            });
    };

    /**
     * Syntactic sugar over the fetch post
     * @param subdomain the subdomain of the api we're calling
     * @param path the path relative to the base url
     * @param queryParams a query params object representing the query portion of the url
     * @param bodyData any body relevant to the call as a js object
     * @returns a promise which will resolve to the result of the POST call
     */
    this.doPost = function(subdomain, path, queryParams, bodyData) {
        const body = JSON.stringify(bodyData);
        const url = urlConstructor(subdomain, path, queryParams);
        return headersConstructor(configuration.headers)
            .then(headers => {
                const opts = {method: 'POST', headers, mode: configuration.mode, body};
                return retryingFetch(url, opts).then(responseHandler)
            });
    };

    /**
     * Syntactic sugar over fetch patch
     * @param subdomain the subdomain of the api we're calling
     * @param path the path relative to the base url
     * @param queryParams a query params object representing the query portion of the url
     * @param bodyData any body relevant to the call
     * @returns a promise which will resolve to the result of the PATCH call
     */
    this.doPatch = function(subdomain, path, queryParams, bodyData) {
        const body = JSON.stringify(bodyData);
        const url = urlConstructor(subdomain, path, queryParams);
        return headersConstructor(configuration.headers)
            .then(headers => {
                const opts = {method: 'PATCH', headers, mode: configuration.mode, body};
                return retryingFetch(url, opts).then(responseHandler)
            });
    };
}


export default FetchClient;