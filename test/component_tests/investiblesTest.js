//npm stuff for node test env
let fetch = require('node-fetch');
global.fetch = fetch;

let assert = require('assert');

let testConfig = {
    baseURL: 'http://localhost:3001',
    headers: {}
};

import aclient from '../../src/components/fetchClient.js';
let client = aclient(testConfig);
import inv from '../../src/components/investibles.js';
let investibles = inv(client);

//set up a simple http server for our tests
const express = require('express');
const app = express();
const port = 3001;
const server = require('http').createServer(app);
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/investibles', (request, response) => {
    response.json({test_body: request.body});
});

app.patch('/investibles/asdf3', (request, response) => {
    response.json({test_body: request.body});
});

app.get('/investibles/asdf4', (request, response) => {
    response.json({id: 'asdf4'});
});

app.patch('/investibles/steak/follow/meat', (request, response) => {
    response.json({success_message: 'unfollowed', test_body: request.body});
});


app.patch('/investibles/EXXXOONN/resolve/oil', (request, response) => {
    response.json({success_message: 'Investible resolved'});
})

describe('Investibles', () => {
    before(() => {
        server.listen(port);
    });

    after(() => {
        server.close();
    });


    describe('#doCreate', () => {
        it('should create investible without error', () => {
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
            promise.then((result) => {
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
            let promise = investibles.follow('steak', 'meat', true);
            promise.then((result) => {
                assert(result.success_message === 'unfollowed', 'Should have returned the proper success message');
                assert(result.test_body.remove, 'Should have put the remove request in the body');
            });
        });
    });


    describe('#doResolveInvestible', () => {
        it('should resolve the market category without error', () =>{
            let promise = investibles.resolve('EXXXOONN', 'oil');
            promise.then((result) => {
                assert(result.success_message === 'Investible resolved', 'Should have returned the proper success message');
            });
        });
    });


    describe('#doGet', () => {
        it('should get investible without error', () => {
            let promise = investibles.get('asdf4');
            promise.then((result) => {
                //console.log(result);
                assert(result.id === 'asdf4', 'Should have returned asdf4 as id')
            }).catch((error) => {
                console.error(error);
            });
        });
    });


});
