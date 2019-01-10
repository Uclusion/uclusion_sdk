export function FetchClient(passedConfig){

    let configuration = Object.assign({}, passedConfig);

    let responseHandler = (response) => {
        // if we're 400, 401 or 403 we're unauthorized so jsut tell the authorizer to reauthorize us
        // and abandon the current call
        if (response.status === 400 || response.status == 401 || response.status === 403){
            configuration.authorizer.reauthorize() // no page or dest url since I don't have it handy
        } else if (!response.ok) {
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
                if (key.toLowerCase() == 'content-type' && value.toLowerCase().indexOf("json") != -1){
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
        let newHeaders = Object.assign({}, headers);
        newHeaders['Authorization'] = configuration.authorizer.getToken();
        //console.log(newHeaders);
        return newHeaders;
    };

    /**
     * Syntactic sugar over fetch get
     * @param path the path relative to the base url
     * @param queryParams a query params object representing the query portion of the url
     * @returns a promise which will resolve to the result of the get call
     */
    this.doGet = function (subdomain, path, queryParams) {
        let url = urlConstructor(subdomain, path, queryParams);
        const headers = headersConstructor(configuration.headers);
        //console.log(headers);
        let promise = fetch(url, {method: 'GET', headers: headers}).then(responseHandler);
        return promise;
    };

    /**
     * Syntactic sugar over fetch delete
     * @param path the path relative to the base url
     * @param queryParams a query params object representing the query portion of the url
     * @param body any method body relevant to the call
     * @returns a promise which will resolve to the result of the DELETE call
     */
    this.doDelete = function(subdomain, path, queryParams) {
        let url = urlConstructor(subdomain, path, queryParams);
        const headers = headersConstructor(configuration.headers);
        //console.log(headers);
        let promise = fetch(url, {method: 'DELETE', headers: headers}).then(responseHandler);
        return promise;
    };

    /**
     * Syntactic sugar over the fetch post
     * @param path the path relative to the base url
     * @param queryParams a query params object representing the query portion of the url
     * @param body any body relevant to the call as a js object
     * @returns a promise which will resolve to the result of the POST call
     */
    this.doPost = function(subdomain, path, queryParams, body) {
        let url = urlConstructor(subdomain, path, queryParams);
        const headers = headersConstructor(configuration.headers);
        //console.log(headers);
        let promise = fetch(url, {method: 'POST', body: JSON.stringify(body), headers: headers}).then(responseHandler);
        return promise;
    };

    /**
     * Syntactic sugar over fetch patch
     * @param path the path relative to the base url
     * @param queryParams a query params object representing the query portion of the url
     * @param body any body relevant to the call
     * @returns a promise which will resolve to the result of the PATCH call
     */
    this.doPatch = function(subdomain, path, queryParams, body) {
        let url = urlConstructor(subdomain, path, queryParams);
        let headers = headersConstructor(configuration.headers);
        //console.log(headers);
        let promise = fetch(url, {method: 'PATCH', body: JSON.stringify(body), headers: headers}).then(responseHandler);
        return promise;
    };
}


export default FetchClient;