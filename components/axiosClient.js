let axios = require('axios');


function AxiosClient(configuration) {
    //console.log(configuration);
    const instance = axios.create(configuration);
    //console.log(instance);
    this.doGet = function (path, queryParams) {
        let promise = instance.get(path, {params: queryParams});
        return promise;
    };
}

module.exports = function (configuration) {
    let myClient = new AxiosClient(configuration);
    return myClient;
};


