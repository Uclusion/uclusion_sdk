let assert = require('assert');

let testConfig = {
    baseURL: 'http://localhost:3001',
    headers: {}
};

let client = require('../../components/axiosClient')(testConfig);
let markets = require('../../components/markets.js')(client);

//set up a simple http server for our tests
const express = require('express');
const app = express();
const port = 3001;
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.post('/markets/h3x3n/invite', (request, response) => {
    response.json({success_message: 'User invitation being processed', test_body: request.body});
});

app.post('/markets/n3wbie/users/myUser/grant', (request, response) => {
    response.json({quantity: request.body.quantity});
});

app.post('/markets/DanielsMarket/investments', (request, response) => {
    response.json({ userid: 'myUser' , test_body: request.body})
});

app.delete('/markets/foobar/investments/dead', (request, response) => {
    response.json({success_message: 'Idea shares returned'})
});

app.post('/markets', (request, response) => {
    response.json({id: 'ARG', test_body: request.body});
});

app.get('/markets/futures', (request, response) => {
    response.json({id: 'futures'});
});

app.patch('/markets/fish', (request, response) => {
    response.json({id: 'fish', test_body: request.body});
});

app.patch('/markets/oil/resolve', (request, response) => {
    response.json({success_message: 'Category being resolved', test_body: request.body});
});

app.patch('/markets/oil/investibles/EXXXOONN/resolve', (request, response) => {
    response.json({success_message: 'Investible resolved'});
});

app.patch('/markets/meat/investibles/steak/follow', (request, response) => {
    response.json({success_message: 'unfollowed', test_body: request.body});
});

app.patch('/markets/meat/follow', (request, response) => {
    response.json({success_message: 'unfollowed', test_body: request.body});
});


describe('Market', () => {
    before(() => {
        server.listen(port);
    });

    after(() => {
        server.close();
    });

    describe('#doInvite', () => {
        it('should invite user without error', () => {
            let promise = markets.invite('h3x3n', 'me@example.com', 100);
            promise.then((result) => {
                //console.log(result);
                assert(result.success_message === 'User invitation being processed', 'Should have succeded in invite');
                assert(result.test_body.email === 'me@example.com', 'Did not pass the correct email in body');
                assert(result.test_body.quantity === 100, 'Did not pass the correct quantity in body');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doGrant', () => {
        it('should grant user shares without error', () => {
            let promise = markets.grant('n3wbie', 'myUser', 1090);
            promise.then((result) => {
                //console.log(result);
                assert(result.quantity === 1090, 'Should have granted the proper amount');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doCreateInvestment', () => {
      it('should create an investment', () => {
          let promise = markets.createInvestment('DanielsMarket', 'NewInvestment', 500);
          promise.then((result) => {
            assert(result.userid === 'myUser', 'Did not return the proper user id from the result');
            assert(result.test_body.quantity === 500, 'Did not pass the proper quantity in the body');
            assert(result.test_body.investible_id === 'NewInvestment', 'Did not pass the proper investment id in the body');
          });
        });
    });


    describe('#doGrant', () => {
        it('should delete the investment without error', () => {
            let promise = markets.deleteInvestment('foobar', 'dead');
            promise.then((result) => {
                //console.log(result);
                assert(result.success_message === 'Idea shares returned', 'Should have returned the proper success message');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doCreate', () => {
        it('should create the market without error', () =>{
            const marketOptions = { name: 'Foo', description: 'FakeMarket', quantity: 100};
            let promise = markets.createMarket(marketOptions);
            promise.then((result) => {
                assert(result.id === 'ARG');
                assert(result.test_body.name === marketOptions.name, 'Market Options should match request body');
            });
        });
    });

    describe('#doGet', () => {
        it('should get the market without error', () =>{
            let promise = markets.getMarket('futures');
            promise.then((result) => {
                assert(result.id === 'futures');
            });
        });
    });

    describe('#doUpdate', () => {
        it('should update the market without error', () =>{
            const marketUpdateOptions = { name: 'Foo', description: 'FakeMarket', trendingWindow: 180};
            let promise = markets.updateMarket('fish', marketUpdateOptions);
            promise.then((result) => {
                assert(result.id === 'fish');
                assert(result.test_body.description === marketUpdateOptions.description, 'Market Update Options should match request body');
            });
        });
    });

    describe('#doResolveCategory', () => {
        it('should resolve the market category without error', () =>{
            let promise = markets.resolveCategory('oil', 'brent crude');
            promise.then((result) => {
                assert(result.success_message === 'Category being resolved');
                assert(result.test_body.category === 'brent crude', 'Category to resolve should have been in the body');
            });
        });
    });

    describe('#doResolveInvestible', () => {
        it('should resolve the market category without error', () =>{
            let promise = markets.resolveInvestible('oil', 'EXXXOONN');
            promise.then((result) => {
                assert(result.success_message === 'Investible resolved', 'Should have returned the proper success message');
            });
        });
    });

    describe('#doUnfollowMarket', () => {
        it('should follow the investible without error', () =>{
            let promise = markets.followMarket('meat', true);
            promise.then((result) => {
                assert(result.success_message === 'unfollowed', 'Should have returned the proper success message');
                assert(result.test_body.remove, 'Should have put the remove request in the body');
            });
        });
    });

    describe('#doUnfollowInvestible', () => {
        it('should follow the investible without error', () =>{
            let promise = markets.followInvestible('meat', 'steak', true);
            promise.then((result) => {
                assert(result.success_message === 'unfollowed', 'Should have returned the proper success message');
                assert(result.test_body.remove, 'Should have put the remove request in the body');
            });
        });
    });
});
