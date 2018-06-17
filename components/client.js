const https = require('https');
const URL = require('url').URL;
const URLSearchParams = require('url').URLSearchParams;


let fabricateOptions = function (url, method) {
// Not going to allow non standard ports or any proto but HTTPS for the url
   // console.log(url);
    let options = {
        host: url.host,
        method: method,
        path: url.pathname + url.search,
        headers: client.configuration.headers
    };
    return options;
};

let client = () => {};


let performRequest = function (path, method, queryParams) {
    let url = new URL(path, client.configuration.baseUrl);
    if (queryParams) {
        const searchParams = new URLSearchParams(queryParams)
        for (key in queryParams) {
            searchParams.set(key, queryParams[key])
        }
        url.search = searchParams;
    }
    const options = fabricateOptions(url, method);
    return new Promise(function(resolve, reject){
        let responseHandler = function(response){
            responseHandler.data = '';
            responseHandler.statusCode = response.statusCode;
            responseHandler.statusMessage = response.statusMessage;
            if(response.statusCode >299 || response.statusCode < 200){
                reject(responseHandler);
            }

            response.on('data', (chunk) => {
                responseHandler.data += chunk;
            });

            response.on('error', (err) => {
                responseHandler.error = err;
                reject(responseHandler);
            });

            response.on('end', () => {
                resolve(responseHandler);
            })
        };
        //console.log(options);
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

/** I'm assuming sync callback here. This is not technically correct */

/**
 * Performs an HTTP get request at the url formed from client.configuration.baseUrl + path
 * @param the path, relative to the client's base URL we want to perform a get on
 * @param queryParams a javascript key/value object with all query params needed for the get
 */
client.doGet = function (path, queryParams) {
    let requestPromise = performRequest(path, 'GET', queryParams);
    return requestPromise;
};
//console.log(client);
module.exports = function(configuration){
    client.configuration = configuration;
    return client;
};
//console.log(module.exports);