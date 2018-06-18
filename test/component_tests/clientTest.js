let assert = require('assert');

let testConfig = {
    baseURL: 'https://www.google.com',
    headers: {}
};

let client = require('../../components/axiosClient.js')(testConfig);
//console.log(client);



describe('Client', () => {
    describe('#doGet', () =>{
        it('should fetch google without error', () => {
            let promise = client.doGet('/');
            promise.then((result) => {
            //    console.log(result);
                assert(result.status == 200, "Google Should have responded OK");
            });
        })
    })
});


