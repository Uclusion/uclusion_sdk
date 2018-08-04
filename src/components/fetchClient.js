
function FetchClient(configuration){

    const defaultHeaders = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Accept' : 'application/json, text/plain, */*'
    };

    let actualHeaders = Object.assign(defaultHeaders, configuration.headers);
    configuration.headers = actualHeaders;
    let responseHandler = (response) => {
        if(!response.ok){
            throw response; //give the response to upstream code
        }
        //massage things to be same standard as other clients
        let json = response.json().then((json) => {return {data: json}});

        return json;
    };

    let urlConstructor = (path, queryParams) => {
        let url = new URL(configuration.baseURL + '/' + path);
        let search = url.searchParams;
        for(var key in queryParams){
            search.set(key, queryParams[key]);
        }
        url.search = search.toString();
        //console.log(url);
        return url;
    };

    let headersConstructor = (headers) => {
        return headers;
    };


    /**
     * Syntactic sugar over fetch get
     * @param path the path relative to the base url
     * @param queryParams a query params object representing the query portion of the url
     * @returns a promise which will resolve to the result of the get call
     */
    this.doGet = function (path, queryParams) {
        let url = urlConstructor(path, queryParams);
        let headers = headersConstructor(configuration.headers);
        let args = {method: 'GET', headers: headers};
        let promise = fetch(url, args)
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
        let args = {method: 'DELETE', headers: configuration.headers};
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
        let headers = headersConstructor(configuration.headers);
        let args = {method: 'POST', headers: headers};
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
        let args = {method: 'PATCH', headers: configuration.headers};
        let promise = fetch(url, {method: 'PATCH', body: JSON.stringify(body), headers: configuration.headers})
            .then(responseHandler);
        return promise;
    };

    this.setAuthorization = function(token) {
        configuration.headers['Authorization'] = token;
        //console.log(configuration);
    };

}

let configuredClient = function (configuration) {
    let myClient = new FetchClient(configuration);
    return myClient;
};

//module.exports = configuredClient;
export default configuredClient;