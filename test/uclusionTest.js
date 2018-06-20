let assert = require('assert');

let uclusion = require('../uclusion.js')
console.log(uclusion);
const configuration = {
    baseURL: 'https://1o2q4miwg8.execute-api.us-west-2.amazonaws.com/dev',
    username: 'testeruclusion@gmail.com',
    password: 'Uclusi0n_test',
    poolId: 'us-west-2_Z3vZuhzd2',
    clientId: '2off68ct2ntku805jt7sip0j1b'
};

describe('uclusion', () => {
    describe('#doLogin and get user', () => {
        it('should login and pull without error', () => {
            let userId = '6636f2b2-d1a0-4ed7-ad98-0427a6e7e483';
            let promise = uclusion.constructClient(configuration);
            promise.then((client) => {
                return client.user.get(userId);
            }).then((user) => {
      //        console.log(user);
              assert(userId == user.id, 'Fetched user did not match me');
            });
        });
    });
});
