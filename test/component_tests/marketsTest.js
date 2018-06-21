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
                assert(result.success_message == 'User invitation being processed', 'Should have succeded in invite');
                assert(result.test_body.email == 'me@example.com', 'Did not pass the correct email in body');
                assert(result.test_body.quantity == 100, 'Did not pass the correct quantity in body');
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
                assert(result.quantity == 1090, 'Should have granted the proper amount');
            }).catch((error) => {
                console.error(error);
            });
        });
    });


});
