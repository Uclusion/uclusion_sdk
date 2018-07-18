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
const updateOptions = {
    name : 'fish',
    description: 'this is a fish market',
    trending_window: 5
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
    describe('#doCreate, update, grant, and follow market', () => {
        it('should create market without error', () => {
            let userId = '6636f2b2-d1a0-4ed7-ad98-0427a6e7e483';
            let promise = uclusion.constructClient(configuration);
            let globalClient;
            let globalMarketId;
            promise.then((client) => {
                globalClient = client;
                return client.markets.createMarket(marketOptions);
            }).then((response) => {
                globalMarketId = response.market_id;
                return globalClient.markets.getMarket(response.market_id);
            }).then((market) => {
                assert(market.name === 'Default', 'Name is incorrect');
                assert(market.description === 'This is default.', 'Description is incorrect');
                assert(market.follow_default === false, 'Follow is incorrect, should be false');
                assert(market.trending_window === 2, 'Trending window is incorrect, should be 2');
                assert(market.manual_roi === false, 'Roi is incorrect, should be false');
                assert(market.unspent === 10000, 'Quantity is incorrect, should be 10000');
                return globalClient.markets.updateMarket(globalMarketId, updateOptions);
            }).then((response) => globalClient.markets.getMarket(globalMarketId)
            ).then((market) => {
                assert(market.name === 'fish', 'Name is incorrect');
                assert(market.description === 'this is a fish market', 'Description is incorrect');
                assert(market.trending_window === 5, 'Trending window is incorrect, should be 5');
                return globalClient.markets.grant(globalMarketId, userId, 1000);
            }).then((response) => {
                assert(response.quantity === 11000, 'Incorrect quantity, should be 11000');
                return globalClient.markets.followMarket(globalMarketId, false);
            }).then((response) => {
                assert(response.following === true, 'Following incorrect, should be true');
                return globalClient.markets.getMarket(globalMarketId);
            }
            ).then((market) => {
                assert(market.unspent === 11000, 'Quantity is incorrect, should be 11000');
                return globalClient.users.get(userId);
            }).then((user) => {
                assert(_getPresenceFromPresences(globalMarketId,user.market_presences).following === true, 'Following should be true');
            });
        });
    });
});

let _getPresenceFromPresences = (market_id, market_presences) => {
    let presences = market_presences.filter(function (el) {
        return el.market_id === market_id;
    });
    if (presences.length > 0) {
        return presences[0];
    }
};

