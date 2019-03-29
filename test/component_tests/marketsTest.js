import assert from 'assert';
import { serverCreator, clientCreator } from './testSetup';
const {app, server} = serverCreator();

import { Markets } from '../../src/components/markets.js';
let markets = null;

app.post('/DanielsMarket/teams/MyTeam/invest', (request, response) => {
    response.json({ userid: 'myUser' , test_body: request.body})
});

app.delete('/foobar/investments/dead', (request, response) => {
    response.json({success_message: 'Idea shares returned'})
});

app.post('/create', (request, response) => {
    response.json({id: 'ARG', test_body: request.body});
});

app.get('/futures', (request, response) => {
    response.json({id: 'futures'});
});

app.patch('/fish', (request, response) => {
    response.json({id: 'fish', test_body: request.body});
});

app.patch('/oil/resolve', (request, response) => {
    response.json({success_message: 'Category being resolved', test_body: request.body});
});

app.patch('/follow/meat', (request, response) => {
    response.json({test_body: request.body});
});

app.get('/roi/aresolutionid', (request, response) => {
    response.json({test_query: request.query});
});

app.get('/meat/investibles', (request, response) => {
    response.json(request.query);
});

app.get('/list/russel', (request, response) => {
    response.json({id: 'terrier'});
});

app.get('/list/barron', (request, response) => {
    response.json({type: 'userInvestments', test_query: request.query});
});

app.get('/stock/stages', (request, response) => {
    response.json({result: 'ack'});
});
app.post('/fish/stage', (request, response) => {
    response.json({'id': 'deboned', test_body: request.body});
});

describe('Market', () => {
    before(() => {
        const client = clientCreator(server);
        markets = new Markets(client);
    });

    after(() => {
        server.close();
    });

    describe('#doCreateStage', () => {
        it('should create a stage', () => {
           let promise = markets.createStage('fish', {name: 'tuna'});
           promise.then((result) => {
              assert(result.id === 'deboned', 'Did not return the proper stage id');
              assert(result.test_body.name === 'tuna', 'Did not pass the proper name in the body');
           });
        });
    });

    describe('#doCreateInvestment', () => {
      it('should create an investment', () => {
          let promise = markets.createInvestment('DanielsMarket', 'MyTeam', 'NewInvestment', 500);
          promise.then((result) => {
            assert(result.userid === 'myUser', 'Did not return the proper user id from the result');
            assert(result.test_body.quantity === 500, 'Did not pass the proper quantity in the body');
            assert(result.test_body.investible_id === 'NewInvestment', 'Did not pass the proper investment id in the body');
          });
        });
    });

    describe('#doInvestAndBind', () => {
        it('should invest and bind', () => {
            let promise = markets.investAndBind('DanielsMarket', 'MyTeam', 'NewInvestment', 500, ['foo', 'bar']);
            promise.then((result) => {
                assert(result.userid === 'myUser', 'Did not return the proper user id from the result');
                assert(result.test_body.quantity === 500, 'Did not pass the proper quantity in the body');
                assert(result.test_body.investible_id === 'NewInvestment', 'Did not pass the proper investment id in the body');
                assert(JSON.stringify(result.test_body.category_list) === JSON.stringify(['foo', 'bar']), 'Did not pass the correct category list in body');
            });
        });
    });

    describe('#doDeleteInvestment', () => {
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
            let promise = markets.get('futures');
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
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doUnfollowMarket', () => {
        it('should follow the investible without error', () =>{
            let promise = markets.followMarket('meat', true);
            promise.then((result) => {
                assert(result.test_body.remove, 'Should have put the remove request in the body');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doListRoi', () => {
        it('should get the Roi without error', () =>{
            let promise = markets.listRoi('marketwithroi', 'aresolutionid');
            promise.then((result) => {
                //console.log(JSON.stringify(result));
                assert(result.test_query.marketId === 'marketwithroi', 'Should have returned proper market');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doGetMarketInvestibles', () => {
        it('should get the investibled without error', () =>{
            let promise = markets.getMarketInvestibles('meat', ['chicken', 'ham']);
            promise.then((results) => {
                assert(results.id[0] === 'chicken', 'Should have returned proper id');
                assert(results.id[1] === 'ham', 'Should have returned proper id');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doListInvestibles', () => {
        it('should get  the investible without error', () =>{
            let promise = markets.listInvestibles('russel');
            promise.then((result) => {
                assert(result.id === 'terrier');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doListStages', () => {
        it('should list the stages without error', () =>{
            let promise = markets.listStages('stock');
            promise.then((result) => {
                assert(result.result === 'ack');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doListUserInvestments', () => {
        it('should get  the investible without error', () =>{
            let promise = markets.listUserInvestments('barron', 'daniel', 20, 'lastKey');
            promise.then((result) => {
                assert(result.test_query.userId === 'daniel', 'Should have returned proper user id');
                assert(result.test_query.lastEvaluatedKey === 'lastKey', 'Should have returned proper last key');
                assert(parseInt(result.test_query.pageSize) === 20, 'Should have returned proper page size');
            }).catch((error) => {
                console.error(error);
            });
        });
    });
});
