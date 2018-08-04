
function FetchClient(configuration){

    const defaultHeaders = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
    };

    let actualHeaders = Object.assign(defaultHeaders, configuration.headers);
    configuration.headers = actualHeaders;


    let responseHandler = (response) => {
            if(!response.ok){
                throw new Error("FAILED response!"); //todo improve this to have the error etc
            }
            return response.json();
    };

    let urlConstructor = (path, queryParams) => {
        let url = new URL(path, configuration.baseURL);
        let search = url.searchParams;
        for(var key in queryParams){
            search.set(key, queryParams[key]);
        }
        url.search = search.toString();
        return url;
    };

    /**
     * Syntactic sugar over fetch get
     * @param path the path relative to the base url
     * @param queryParams a query params object representing the query portion of the url
     * @returns a promise which will resolve to the result of the get call
     */
    this.doGet = function (path, queryParams) {
        let url = urlConstructor(path, queryParams);
        let promise = fetch(url, {method: 'GET', headers: configuration.headers})
            .then(responseHandler);
        return promise;
    };

    /**
     * Syntactic sugar over fetch delete
     * @param path the path relative to the base url
     * @param queryParams a query params object representing the query portion of the url
     * @param body any method body relevant to the call
     * @returns a promise which will resolve to the result of the DELETE call
     */
    this.doDelete = function(path, queryParams) {
        let url = urlConstructor(path, queryParams);
        let promise = fetch(url, {method: 'DELETE', headers: configuration.headers})
            .then(responseHandler);
        return promise;
    };

    /**
     * Syntactic sugar over the fetch post
     * @param path the path relative to the base url
     * @param queryParams a query params object representing the query portion of the url
     * @param body any body relevant to the call as a js object
     * @returns a promise which will resolve to the result of the POST call
     */
    this.doPost = function(path, queryParams, body) {
        let url = urlConstructor(path, queryParams);
        let promise = fetch(url, {method: 'POST', body: JSON.stringify(body), headers: configuration.headers})
            .then(responseHandler);
        return promise;
    };

    /**
     * Syntactic sugar over fetch patch
     * @param path the path relative to the base url
     * @param queryParams a query params object representing the query portion of the url
     * @param body any body relevant to the call
     * @returns a promise which will resolve to the result of the PATCH call
     */
    this.doPatch = function(path, queryParams, body) {
        let url = urlConstructor(path, queryParams);
        let promise = fetch(url, {method: 'PATCH', body: JSON.stringify(body), headers: configuration.headers})
            .then(responseHandler);
        return promise;
    };

    this.setAuthorization = function(token) {
        configuration.headers['Authorization'] = token;
    };

}

let configuredClient = function (configuration) {
    let myClient = new FetchClient(configuration);
    return myClient;
};

export default configuredClient;