let assert = require('assert');

let testConfig = {
    baseUrl: 'http://www.google.com',
    headers: {}
};

let client = require('../../components/client.js')(testConfig);
//console.log(client);

describe('Client', () => {
    describe('#doGet', () =>{
        it('should fetch google without error', () => {
            let promise = client.doGet('/');
            promise.then((result) => {
                assert(result.statusCode == 200, "Google Should have responded OK");
            }).catch((error) => {
                console.error(error);
                assert.fail("Google should have succeeded");
            });
        })
    })
});


