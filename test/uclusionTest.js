let assert = require('assert');

let uclusion = require('../uclusion.js')

const configuration = {
    baseURL: '',
    username: '',
    password: '',
    poolId: '',
    clientId: ''
};

describe('uclusion', () => {
    describe('#doLogin', () => {
        it('should login without error', () => {
            let promise = uclusion.connstructClient(configuration);
            promise.then((client) => {
                assert(client, 'client object is not null');
            });
        })
    })
});