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
    console.log(configuration);
    const instance = axios.create(configuration);
    console.log(instance);
    this.doGet = function (path, queryParams) {
        let promise = instance.get(path, {params: queryParams});
        return promise;
    };
}

module.exports = function (configuration) {
    let myClient = new AxiosClient(configuration);
    return myClient;
};
