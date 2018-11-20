import assert from 'assert';
import { serverCreator, clientCreator } from './testSetup';
const {app, server} = serverCreator();


app.post('/create', (request, response) => {
    response.json({test_body: request.body});
});

app.patch('/asdf3', (request, response) => {
    response.json({test_body: request.body});
});

app.get('/asdf4', (request, response) => {
    response.json({id: 'asdf4'});
});

app.patch('follow/steak/', (request, response) => {
    response.json({success_message: 'unfollowed', test_body: request.body});
});

app.get('/list', (request, response) => {
    response.json({investibleTemplates: 'fiction'});
});


app.patch('/meat', (request, response) => {
    response.json({success_message: 'updated', test_body: request.body});
});

import {Investibles } from '../../src/components/investibles.js';



let investibles = null;

describe('Investibles', () => {
    before(() => {
        const client = clientCreator(server);
        investibles = new Investibles(client);
    });

    after(() => {
        server.close()
    });

    describe('#doCreate', () => {
        it('should create investible without error', () => {
            assert(server.listening);
            let promise = investibles.create('investiblesName', 'this is description', ['foo', 'bar']);
            promise.then((result) => {
                assert(result.test_body.name === 'investiblesName', 'Did not pass the correct name in body');
                assert(result.test_body.description === 'this is description', 'Did not pass the correct description in body');
                assert(JSON.stringify(result.test_body.category_list) === JSON.stringify(['foo', 'bar']), 'Did not pass the correct category list in body');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doUpdate', () => {
        it('should update investible without error', () => {
            let promise = investibles.update('asdf3', 'investiblesName', 'this is description', ['foo', 'bar']);
            return promise.then((result) => {
                //console.log(result);
                assert(result.test_body.name === 'investiblesName', 'Did not pass the correct name in body');
                assert(result.test_body.description === 'this is description', 'Did not pass the correct description in body');
                assert(JSON.stringify(result.test_body.category_list) === JSON.stringify(['foo', 'bar']), 'Did not pass the correct category list in body');
            }).catch((error) => {
                console.error(error);
            });
        });
    });


    describe('#doUnfollowInvestible', () => {
        it('should follow the investible without error', () =>{
            let promise = investibles.follow('steak', true);
            promise.then((result) => {
                assert(result.success_message === 'unfollowed', 'Should have returned the proper success message');
                assert(result.test_body.remove, 'Should have put the remove request in the body');
            });
        });
    });


    describe('#doGet', () => {
        it('should get investible without error', async () => {
            let promise = investibles.get('asdf4');
            await promise.then((result) => {
                //console.log(result);
                assert(result.id === 'asdf4', 'Should have returned asdf4 as id')
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doListInvestibleTemplates', () => {
        it('should get  the investible without error', () =>{
            let promise = investibles.listTemplates();
            promise.then((result) => {
                assert(result.investibleTemplates === 'fiction', 'Should have returned proper investible templates');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doUpdateMarketInvestible', () => {
        it('should update the investible without error', () =>{
            let promise = investibles.updateInMarket('meat', 'pork', 'foo', 'mydesc', ['a']);
            promise.then((result) => {
                assert(result.success_message === 'updated', 'Should have returned the proper success message');
                assert(result.test_body.name === 'foo', 'Should have put the name in the body');
                assert(result.test_body.market_id === 'pork', 'Should have put market id in the body');
                assert(result.test_body.category_list[0]  === 'a', 'Should have put the category in the body');
            });
        });
    });

});
