let assert = require('assert');

let testConfig = {
    baseURL: 'http://localhost:3001',
    headers: {}
};

import aclient from '../../components/axiosClient';
let client = (testConfig);
import inv from '../../components/investibles.js';
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

app.get('/investibles/asdf3', (request, response) => {
    response.json({id: 'asdf3'});
});

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
                //console.log(result);
                assert(result.test_body.name === 'investiblesName', 'Did not pass the correct name in body');
                assert(result.test_body.description === 'this is description', 'Did not pass the correct description in body');
                assert(JSON.stringify(result.test_body.categoryList) === JSON.stringify(['foo', 'bar']), 'Did not pass the correct category list in body');
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
                assert(JSON.stringify(result.test_body.categoryList) === JSON.stringify(['foo', 'bar']), 'Did not pass the correct category list in body');
            }).catch((error) => {
                console.error(error);
            });
        });
    });
    describe('#doGet', () => {
        it('should get investible without error', () => {
            let promise = investibles.get('asdf3');
            promise.then((result) => {
                //console.log(result);
                assert(result.id === 'asdf3', 'Should have returned asdf3 as id')
            }).catch((error) => {
                console.error(error);
            });
        });
    });


});
