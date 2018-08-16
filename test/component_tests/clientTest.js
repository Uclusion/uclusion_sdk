//npm stuff for node test env
let fetch = require('node-fetch');
global.fetch = fetch;

import assert from 'assert';

let testConfig = {
    baseURL: 'https://www.google.com',
    headers: {}
};

import aclient from '../../src/components/fetchClient.js';
let client = aclient(testConfig);
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
    });
});
