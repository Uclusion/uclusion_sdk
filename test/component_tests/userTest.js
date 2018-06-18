let assert = require('assert');

let testConfig = {
    baseUrl: 'http://localhost:3001',
    headers: {}
};

let client = require('../../components/client.js')(testConfig);
let user = require('../../components/user.js')(client);


let nodeTestingServer = require('node-testing-server').nodeTestingServer;
nodeTestingServer.config = {
    hostname: 'localhost',
    port: 3001,
    logsEnabled: 1,
    pages: {
        '/users/1234': '{"id": "1234"}'
    }
};

describe('User', () => {
    before(() => {
        nodeTestingServer.start();
    });

    after(() => {
        nodeTestingServer.stop();
    });
    describe('#doGet', () =>{
        it('should fetch user without error', () => {
            let promise = user.get('1234');
            promise.then((result) => {
                console.log(result);
                assert(result.id = '1234', "Client should have returned 1234 as it's ID");
            }).catch((error) => {
                console.error(error);
            });
        })
    })

});
