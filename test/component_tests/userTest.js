let assert = require('assert');

let testConfig = {
    baseURL: 'http://localhost:3001',
    headers: {}
};

let client = require('../../components/axiosClient')(testConfig);
let user = require('../../components/user.js')(client);

//set up a simple http server for our tests
const express = require('express');
const app = express();
const port = 3001;
const server = require('http').createServer(app);
const  bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/users/1234', (request, response) => {
    response.json({id: 1234});
});

app.delete('/users', (request, response) => {
    response.json({success_message: 'User deleted'});
});

app.patch('/users', (request, response) => {
    response.json({success_message: 'User updated', test_body: request.body});
});

describe('User', () => {
    before(() => {
        server.listen(port);
    });

    after(() => {
        server.close();
    });

    describe('#doGet', () => {
        it('should fetch user without error', () => {
            let promise = user.get('1234');
            promise.then((result) => {
                //console.log(result);
                assert(result.id = '1234', "Client should have returned 1234 as it's ID");
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doDelete', () => {
        it('should delete without error', () => {
            user.delete('I hate uclusion so I\'m deleting myself')
                .then((result) => {
                    assert(result.success_message = 'User deleted');
                }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doPatch', () => {
        it('should update without error', () => {
            user.update('New Name')
                .then((result) => {
                    assert(result.success_message = 'User updated');
                    assert(result.test_body.name  == 'New Name', 'Body passed to server did not match expected');
                }).catch((error) => {
                console.error(error);
            });
        });
    });

});
