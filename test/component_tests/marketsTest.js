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
;

app.patch('/meat/follow', (request, response) => {
    response.json({success_message: 'unfollowed', test_body: request.body});
});


app.get('/meat/investibles/chicken', (request, response) => {
    response.json({id: 'chicken'});
});

app.get('/meat/list', (request, response) => {
    response.json({category: 'fake'});
});

app.get('/list/stocknasdaq/', (request, response) => {
    response.json({type: 'categoryInvestibles', test_query: request.query});
});

app.get('/list/dow', (request, response) => {
    response.json({type: 'investibleInvestments', test_query: request.query});
});

app.get('/list/s&p', (request, response) => {
    response.json({investiblePresences: 'notreal'});
});

app.get('/list/russel', (request, response) => {
    response.json({type: 'investibles', test_query: request.query});
});

app.get('/list/wilshire', (request, response) => {
    response.json({type: 'trending', test_query: request.query});
});

app.get('/list/barron', (request, response) => {
    response.json({type: 'userInvestments', test_query: request.query});
});


describe('Market', () => {
    before(() => {
        const client = clientCreator(server);
        markets = new Markets(client);
    });

    after(() => {
        server.close();
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



    describe('#doGetMarketInvestible', () => {
        it('should get  the investible without error', () =>{
            let promise = markets.getMarketInvestible('meat', 'chicken');
            promise.then((result) => {
                assert(result.id === 'chicken', 'Should have returned proper id');
            });
        });
    });

    describe('#doListCategories', () => {
        it('should get  the investible without error', () =>{
            let promise = markets.listCategories('meat');
            promise.then((result) => {
                assert(result.category === 'fake', 'Should have returned proper category');
            });
        });
    });

    describe('#doListCategoriesInvestibles', () => {
        it('should get  the investible without error', () =>{
            let promise = markets.listCategoriesInvestibles('stocknasdaq', 3, 20, 25);
            promise.then((result) => {
                assert(result.test_query.category == 3, 'Should have returned proper category');
                assert(result.test_query.currentPage == 20, 'Should have returned proper page number');
                assert(result.test_query.pageSize == 25, 'Should have returned proper page size');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doListInvestiblesInvestment', () => {
        it('should get  the investible without error', () =>{
            let promise = markets.listInvestibleInvestments('dow', 'company', 3, 20);
            promise.then((result) => {
                assert(result.test_query.investibleId === 'company', 'Should have returned proper investible id');
                assert(result.test_query.currentPage == 3, 'Should have returned proper current page');
                assert(result.test_query.pageSize == 20, 'Should have returned proper page size');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doListInvestiblePresences', () => {
        it('should get  the investible without error', () =>{
            let promise = markets.listInvestiblePresences('s&p');
            promise.then((result) => {
                assert(result.investiblePresences === 'notreal', 'Should have returned proper investible presences');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doListInvestibles', () => {
        it('should get  the investible without error', () =>{
            let promise = markets.listInvestibles('russel', 'search', 3, 20);
            promise.then((result) => {
                assert(result.test_query.searchString === 'search', 'Should have returned proper search string');
                assert(result.test_query.currentPage == 3, 'Should have returned proper current page');
                assert(result.test_query.pageSize == 20, 'Should have returned proper page size');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doListTrending', () => {
        it('should get  the investible without error', () =>{
            let promise = markets.listTrending('wilshire', '10/10/10');
            promise.then((result) => {
                assert(result.test_query.trendingWindowDate === '10/10/10', 'Should have returned proper trending window date');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doListUserInvestments', () => {
        it('should get  the investible without error', () =>{
            let promise = markets.listUserInvestments('barron', 'daniel', 3, 20);
            promise.then((result) => {
                assert(result.test_query.userId === 'daniel', 'Should have returned proper user id');
                assert(result.test_query.lastEvaluatedKey == 20, 'Should have returned proper current page');
                assert(result.test_query.pageSize == 3, 'Should have returned proper page size');
            }).catch((error) => {
                console.error(error);
            });
        });
    });





});
