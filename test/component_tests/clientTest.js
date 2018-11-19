//npm stuff for node test env
let fetch = require('node-fetch');
global.fetch = fetch;

import assert from 'assert';

const testAuthorizer = {
    authorize: () => {
        return new Promise((resolve, reject) => {
            resolve("foo");
        })
    },
    reauthorize: () => {
        return authorize();
    },
    getToken: () => {
        return "foo";
    }
};

let testConfig = {
    baseURL: 'https://www.google.com',
    headers: {},
    authorizer: testAuthorizer,
    domainMunger: (url, domain) => { return url} //don't do the sub domain additionxx`
};

import aclient from '../../src/components/fetchClient.js';

let client = aclient(testConfig);
//console.log(client);

describe('Client', () => {
    describe('#doGet', () => {
        it('should fetch google without error', () => {
            let promise = client.doGet('/');
            promise.then((result) => {
                //    console.log(result);
                assert(result.status == 200, "Google Should have responded OK");
            });
        })
    });
});
