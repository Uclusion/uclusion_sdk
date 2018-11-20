export function FetchClient(passedConfig){

    let configuration = {...passedConfig};

    const defaultHeaders = {
        'Content-Type': 'application/json;charset=UTF-8',
        // If use these then need to do CORs pre-flight and anyway api gateway should not cache
        // 'Pragma': 'no-cache',
        // 'Cache-Control': 'no-cache, no-store, must-revalidate',
        // 'Expires': '0',
        'Accept' : 'application/json, text/plain, */*'
    };

    let actualHeaders = Object.assign(defaultHeaders, configuration.headers);
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
            search.set(key, queryParams[key]);
        }
        url.search = search.toString();
        //console.log(url);
        return url;
    };

    let headersConstructor = (headers) => {
        let newHeaders = {...headers};
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
        let headers = headersConstructor(configuration.headers);
     //   console.log(headers);
        let promise = this.fetchReauthorize(url, {method: 'GET', headers: headers});
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
        let headers = headersConstructor(configuration.headers);
      //  console.log(headers);
        let promise = this.fetchReauthorize(url, {method: 'DELETE', headers: headers});
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
        let headers = headersConstructor(configuration.headers);
   //     console.log(headers);
        let promise = this.fetchReauthorize(url, {method: 'POST', body: JSON.stringify(body), headers: configuration.headers});
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
    //    console.log(headers);
        let promise = this.fetchReauthorize(url, {method: 'PATCH', body: JSON.stringify(body), headers: headers});
        return promise;
    };


    //lets handle rea-authorization, by retrying on 403 or 401

    this.fetchReauthorize = function(url, options){
        let nonReauthorizingResponseHandler = (response) => {
            if(!response.ok){
                throw response; //give the response to upstream code
            }
            if(isJson(response)) {
                //massage things to be same standard as other clients
                let json = response.json().then((json) => {
                    return {status: response.status, data: json}
                });
                return json;
            }
            //todo make sure it's actually text
            return response.text().then((text) => {return {status: response.status, body:text}});
        };

        let reauthorizingResponseHandler = (response) => {
            if(response.status === 403 || response.status === 401){
                console.log("Reauthorizing");
                //try one more time
                return configuration.authorizer.reauthorize().then((newToken) => {
                    return fetch(url, options).then(nonReauthorizingResponseHandler);
                });
            }
            return nonReauthorizingResponseHandler(response);
        };

        return fetch(url, options).then(reauthorizingResponseHandler);
    }
}
