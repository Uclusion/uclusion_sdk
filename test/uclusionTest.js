let assert = require('assert');

let uclusion = require('../uclusion.js')
console.log(uclusion);
const configuration = {
    baseURL: 'https://rhilzl244c.execute-api.us-west-2.amazonaws.com/dev',
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
const fishOptions = {
    name : 'fish',
    description: 'this is a fish market',
    follow_default: false,
    trending_window: 5,
    manual_roi: false,
    quantity: 10000
};
const updateFish = {
    name : 'pufferfish',
    description: 'possibly poisonous',
    category_list: ['poison', 'chef']
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
                let userPresence = _getPresenceFromPresences(globalMarketId,user.market_presences);
                assert(userPresence.following === true, 'Following should be true');
                assert(userPresence.quantity === 11000, 'Quantity should be 11000')
            });
        });
    });
    describe('#doCreateInvestible, ', () => {
        it('should create investible without error', () => {
            let userId = '6636f2b2-d1a0-4ed7-ad98-0427a6e7e483';
            let promise = uclusion.constructClient(configuration);
            let globalClient;
            let globalInvestibleId;
            promise.then((client) => {
                globalClient = client;
                return client.investibles.create('salmon', 'good on bagels', ['fish', 'water']);
            }).then((response) => {
                //console.log(response);
                globalInvestibleId = response.id;
                assert(response.name === 'salmon', 'name not passed on correctly');
                assert(response.description === 'good on bagels', 'description not passed on correctly');
                assert(_arrayEquals(response.category_list, ['fish', 'water']), 'category list not passed on correctly');
                return globalClient.investibles.update(globalInvestibleId, 'tuna', 'good for sandwich', ['can', 'sandwich']);
            }).then((response) => {
                //console.log(response);
                assert(response.name === 'tuna', 'name not passed on correctly');
                assert(response.description === 'good for sandwich', 'description not passed on correctly');
                assert(_arrayEquals(response.category_list, ['can', 'sandwich']), 'update category list not correct');
                return globalClient.investibles.get(globalInvestibleId);
            }).then((investible) => {
                //console.log(investible);
                assert(investible.name === 'tuna', 'name not passed on correctly');
                assert(investible.description === 'good for sandwich', 'description not passed on correctly');
                assert(_arrayEquals(investible.category_list, ['can', 'sandwich']), 'category list not passed on correctly');
            });
        });
    });
    describe('#doInvestment', () => {
        it('should create investment without error', () => {
            let userId = '6636f2b2-d1a0-4ed7-ad98-0427a6e7e483';
            let promise = uclusion.constructClient(configuration);
            let globalClient;
            let globalMarketId;
            let globalInvestibleId;
            let marketInvestibleId;
            let investmentId;
            promise.then((client) => {
                globalClient = client;
                return client.markets.createMarket(fishOptions);
            }).then((response) => {
                globalMarketId = response.market_id;
                return globalClient.investibles.create('salmon', 'good on bagels', ['fish', 'water']);
            }).then((response) => {
                globalInvestibleId = response.id;
                return globalClient.markets.createInvestment(globalMarketId, globalInvestibleId, 1000);
            }).then((response) => {
                investmentId = response.id;
                marketInvestibleId = response.investible_id;
                assert(response.quantity === 1000, 'investment quantity should be 1000');
                return globalClient.markets.followInvestible(globalMarketId, marketInvestibleId, false);
            }).then((response) => {
                assert(response.following === true, 'follow should return true');
                return globalClient.markets.getMarketInvestible(globalMarketId, marketInvestibleId);
            }).then((investible) => {
                //console.log(response);
                assert(investible.quantity === 1000, 'get investible quantity should return 1000');
                assert(investible.following === true, 'get investible following should be true');
                return globalClient.users.get(userId);
            }).then((user) => {
                let userPresence = _getPresenceFromPresences(globalMarketId,user.market_presences);
                assert(userPresence.quantity === 9000, 'Quantity should be 9000');
                return globalClient.markets.deleteInvestment(globalMarketId, investmentId);
            }).then((response) => {
                return globalClient.users.get(userId);
            }).then((user) => {
                let userPresence = _getPresenceFromPresences(globalMarketId,user.market_presences);
                //console.log(userPresence);
                assert(userPresence.quantity === 10000, 'Quantity should be 10000');
                return globalClient.markets.updateMarketInvestible(globalMarketId, marketInvestibleId, updateFish);
            }).then((response) => {
                assert(response.name === 'pufferfish', 'update market investible name not passed on correctly');
                assert(response.description === 'possibly poisonous', 'update market investible description not passed on correctly');
                assert(_arrayEquals(response.category_list, ['poison', 'chef']), 'update market investible category list not passed on correctly');
                return globalClient.markets.getMarketInvestible(globalMarketId, marketInvestibleId);
            }).then((investible) => {
                //console.log(investible);
                assert(investible.name === 'pufferfish', 'get market investible name incorrect');
                assert(investible.description === 'possibly poisonous', 'get market investible description incorrect');
                assert(_arrayEquals(investible.category_list, ['poison', 'chef']), 'get market investible category list incorrect');
                assert(investible.quantity === 0, 'get market investible quantity incorrect');
                return globalClient.markets.getMarket(globalMarketId);
            }).then((market) => {
                //console.log(market);
                assert(market.open_investments === 0, 'open investments should be 0');
                assert(market.unspent === 10000, 'unspent should be 10000');
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

let _arrayEquals = (arr1, arr2) => {
    if(arr1.length !== arr2.length)
        return false;
    arr1.forEach(function (e) {
        if (arr2.indexOf(e) < 0)
            return false;
    });
    return true;
};



