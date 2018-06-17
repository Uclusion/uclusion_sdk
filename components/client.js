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

// NEED to use a promise to handle to resolve the responsehandler being done

let fabricateRequest = function (path, method, queryParams) {
    let url = new URL('path', this.configuration.baseUrl);
    if (queryParams) {
        const searchParams = new URLSearchParams(queryParams)
        for (key in queryParams) {
            searchParams.set(key, queryParams[key])
        }
    }
    const options = fabricateOptions(url, method);

    let responseHandler = function (response) {
        let me = this;
        let data = '';

        me.statusCode = response.statusCode;
        me.statusMessage = response.statusMessage;
        me.headers = response.headers;

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            me.data = data;
        })

        me.dataJSON  = () => {
            if(me.data){
               return JSON.parse(me.data);
            }
            return '';
        }
    };

    https.request(options, responseHandler)
    return responseHandler; //this will eventually have all the data
};


/**

 let resultHandler = function(incomingMessage){
    return new Promise(function(resolve, reject){
        if(incomingMessage.status == 200){
            resolve(incomingMessage);
        }else{
            reject(incomingMessage);
        }
    });
}
 */


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
    let request = fabricateRequest(path, queryParams, 'GET');
    request.end()
};
module.exports = client;