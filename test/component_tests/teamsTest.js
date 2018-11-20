import assert from 'assert';
import { serverCreator, clientCreator } from './testSetup';
const {app, server} = serverCreator();
import { Teams } from '../../src/components/teams.js';
let teams = null;

app.post('/devil/invite/h3x3n', (request, response) => {
    response.json({success_message: 'User invitation being processed', test_body: request.body});
});

app.post('/realmadrid/bind/fifa', (request, response) => {
    response.json({success_message: 'Team bound', test_body: request.body});
});

app.get('/list', (request, response) => {
    response.json({type: 'list', test_query: request.query});
});


describe('Teams', () => {
    before(() => {
        const client = clientCreator(server);
        teams = Teams(client);
    });

    after(() => {
        server.close();
    });

    describe('#doInvite', () => {
        it('should invite user without error', () => {
            let promise = teams.invite('devil', 'h3x3n', 'me@example.com', 100);
            promise.then((result) => {
                //console.log(result);
                assert(result.success_message === 'User invitation being processed', 'Should have succeded in invite');
                assert(result.test_body.email === 'me@example.com', 'Did not pass the correct email in body');
                assert(result.test_body.quantity === 100, 'Did not pass the correct quantity in body');
            }).catch((error) => {
                console.error(error);
            });
        });
    });


    describe('#doBind', () => {
        it('should bind team without error', () => {
            let promise = teams.bind('realmadrid', 'fifa', 99);
            promise.then((result) => {
                //console.log(result);
                assert(result.success_message === 'Team bound');
                assert(result.test_body.quantity == 99, 'Did not pass the correct quantity in body');
            }).catch((error) => {
                console.error(error);
            });
        });
    });


    describe('#doList', () => {
        it('should get teams', () =>{
            let promise = teams.list();
            promise.then((result) => {
                assert(result.type === 'list');
            }).catch((error) => {
                console.error(error);
            });
        });
    });
});
