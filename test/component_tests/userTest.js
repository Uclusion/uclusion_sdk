let assert = require('assert');

let testConfig = {
    baseURL: 'http://localhost:3001',
    headers: {}
};

let client = require('../../components/axiosClient')(testConfig);
let user = require('../../components/user.js')(client);

// Our testing server insists everything has to end in HTML, but that's not actually required
let nodeTestingServer = require('node-testing-server').nodeTestingServer;
nodeTestingServer.config = {
    hostname: 'localhost',
    port: 3001,
    logsEnabled: 0,
    pages: {
        '/users/1234.html': '{"id": "1234"}'
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
            let promise = user.get('1234.html');
            promise.then((result) => {
                //console.log(result);
                assert(result.id = '1234', "Client should have returned 1234 as it's ID");
            }).catch((error) => {
                console.error(error);
            });
        });
    });

  /*  describe('#doDelete', ()=>{
        it('should delete without error', () => {
          user.delete()
        }
    }); */

});
