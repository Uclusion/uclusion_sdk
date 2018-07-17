let assert = require('assert');

let uclusion = require('../uclusion.js')
console.log(uclusion);
const configuration = {
    baseURL: 'https://gfim0x3nbh.execute-api.us-west-2.amazonaws.com/dev',
    username: 'testeruclusion@gmail.com',
    password: 'Uclusi0n_test',
    poolId: 'us-west-2_Z3vZuhzd2',
    clientId: '2off68ct2ntku805jt7sip0j1b'
};
const marketOptions = {
    name : 'Default',
    description: 'This is default.',
    follow_default: false,
    trending_window: 2,
    manual_roi: false,
    quantity: 10000
};

describe('uclusion', () => {
    describe('#doLogin and update user', () => {
        it('should login and pull without error', () => {
            let userId = '6636f2b2-d1a0-4ed7-ad98-0427a6e7e483';
            let promise = uclusion.constructClient(configuration);
            let globalClient;
            promise.then((client) => {
                globalClient = client;
                return client.users.update('Daniel');
            }).then((response) => {
                assert(response.success_message === 'User updated', 'User update was not successful');
                return globalClient.users.get(userId);
            }).then((user) => {
                //console.log(user);
                assert(userId === user.id, 'Fetched user did not match me');
                assert(user.name === 'Daniel', 'Name not updated properly');
                return globalClient.users.update('Default');
            });
        });
    });
});

describe('uclusion', () => {
    describe('#doLogin and create market', () => {
        it('should login and pull without error', () => {
            let userId = '6636f2b2-d1a0-4ed7-ad98-0427a6e7e483';
            let promise = uclusion.constructClient(configuration);
            let globalClient;
            promise.then((client) => {
                globalClient = client;
                return client.markets.createMarket(marketOptions);
            }).then((response) => {
                return globalClient.markets.getMarket(response.market_id);
            }).then((market) => {
                //console.log(market);
                assert(market.name === 'Default', 'Name is incorrect');
                assert(market.description === 'This is default.', 'Description is incorrect');
                assert(market.follow_default === false, 'Follow is incorrect, should be false');
                assert(market.trending_window === 2, 'Trending window is incorrect, should be 2');
                assert(market.manual_roi === false, 'Roi is incorrect, should be false');
                assert(market.unspent === 10000, 'Quantity is incorrect, should be 10000');
            });
        });
    });
});

