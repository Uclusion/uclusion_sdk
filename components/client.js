const https = require('https');
const url = require('url');

let fabricateOptions = function (url, method) {
// Not going to allow non standard ports or any proto but HTTPS for the url
    let options = {
        host: url.host,
        method: method,
        path: url.pathname + url.search,
        headers: client.configuration.headers
    };
    return options;
};


let performRequest = function (path, method, queryParams) {
    let url = new URL('path', this.configuration.baseUrl);
    if (queryParams) {
        const searchParams = new URLSearchParams(queryParams)
        for (key in queryParams) {
            searchParams.set(key, queryParams[key])
        }
    }
    const options = fabricateOptions(url, method);
    return new Promise(function(resolve, reject){
        let responseHandler = function(response){
            let me = this;
            let data = '';
            me.statusCode = response.statusCode;
            me.statusMessage = response.statusMessage;
            if(response.statusCode >299 || response.statusCode < 200){
                reject(me);
            }

            response.on('data', (chunk) => {
                me.data += chunk;
            });

            response.on('error', (err) => {
                me.error = err;
                reject(me);
            });

            response.on('end', () => {
                resolve(me);
            })
        };

        request = https.request(options, responseHandler);
        request.end();
    });
};


/**
 * Configures the client with proper configuration.
 * Configuration should have the following parameters:
 * baseUrl: the url prefix for the rest api
 * headers: javascript object with all request headers required for the connection
 * @param configuration
 */
let client = function (configuration) {
    this.configuration = configuration;
};

/** I'm assuming sync callback here. This is not technically correct */

/**
 * Performs an HTTP get request at the url formed from client.configuration.baseUrl + path
 * @param the path, relative to the client's base URL we want to perform a get on
 * @param queryParams a javascript key/value object with all query params needed for the get
 */
client.doGet = function (path, queryParams) {
    let requestPromise = performRequest(path, queryParams, 'GET');
    return requestPromise;
};
module.exports = client;