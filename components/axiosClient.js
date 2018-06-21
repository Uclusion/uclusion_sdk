let axios = require('axios');


function AxiosClient(configuration) {
    const defaultHeaders = {
      'Content-Type': 'application/json;charset=UTF-8',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
    let actualHeaders = Object.assign(defaultHeaders, configuration.headers);
    configuration.headers = actualHeaders;
    //console.log(configuration);
    const instance = axios.create(configuration);
    //console.log(instance);
    // Public API portionn

    /**
     * Syntactic sugar over the axios client configuration GET Method
     * @param path the path relative to the base url
     * @param queryParams a query params object representing the query portion of the url
     * @returns a promise which will resolve to the result of the get call
     */
    this.doGet = function (path, queryParams) {
        let promise = instance.get(path, {params: queryParams});
        return promise;
    };

    /**
     * Syntactic sugar over the axios client configuration DELETE Method
     * @param path the path relative to the base url
     * @param queryParams a query params object representing the query portion of the url
     * @param body any method body relevant to the call
     * @returns a promise which will resolve to the result of the DELETE call
     */
    this.doDelete = function(path, queryParams) {
        let promise = instance.delete(path, {params: queryParams});
        return promise;
    };

    /**
     * Syntactic sugar over the axios client configuration POST Method
     * @param path the path relative to the base url
     * @param queryParams a query params object representing the query portion of the url
     * @param body any body relevant to the call
     * @returns a promise which will resolve to the result of the POST call
     */
    this.doPost = function(path, queryParams, body) {
        let promise = instance.post(path, body, {params: queryParams});
        return promise;
    };

    /**
     * Syntactic sugar over the axios client configuration PATCH Method
     * @param path the path relative to the base url
     * @param queryParams a query params object representing the query portion of the url
     * @param body any body relevant to the call
     * @returns a promise which will resolve to the result of the PATCH call
     */
    this.doPatch = function(path, queryParams, body) {
        let promise = instance.patch(path, body, {params: queryParams});
        return promise;
    };

    this.setAuthorization = function(token) {
        instance.defaults.headers.common['Authorization'] = token;
    }
}

module.exports = function (configuration) {
    let myClient = new AxiosClient(configuration);
    return myClient;
};
