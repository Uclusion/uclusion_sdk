export function FetchClient(passedConfig){

    let configuration = Object.assign({}, passedConfig);

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
            .then(headers => fetch(url, {method: 'GET', headers}).then(responseHandler));
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
            .then(headers => fetch(url, {method: 'DELETE', headers}).then(responseHandler));
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
            .then(headers => fetch(url, {method: 'POST', body, headers}).then(responseHandler));
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
            .then(headers => fetch(url, {method: 'PATCH', body, headers}).then(responseHandler));
    };
}


export default FetchClient;