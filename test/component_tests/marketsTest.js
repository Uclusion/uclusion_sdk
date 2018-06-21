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

app.post('/market/h3x3n/invite', (request, response) => {
    response.json({success_message: 'User invitation being processed', test_body: request.body});
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


});
