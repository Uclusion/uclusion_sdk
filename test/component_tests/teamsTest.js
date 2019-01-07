import assert from 'assert';
import { serverCreator, clientCreator } from './testSetup';
const {app, server} = serverCreator();
import { Teams } from '../../src/components/teams.js';
let teams = null;

app.post('/realmadrid/bind/fifa', (request, response) => {
    response.json({success_message: 'Team bound'});
});

app.post('/bind/fifa', (request, response) => {
    response.json({success_message: 'Team bound'});
});

app.get('/roi/teamwithroi', (request, response) => {
    response.json({test_query: request.query});
});

app.get('/list', (request, response) => {
    response.json({type: 'list', test_query: request.query});
});


describe('Teams', () => {
    before(() => {
        const client = clientCreator(server);
        teams = new Teams(client);
    });

    after(() => {
        server.close();
    });

    describe('#doBind', () => {
        it('should bind team without error', () => {
            let promise = teams.bind('realmadrid', 'fifa');
            promise.then((result) => {
                //console.log(result);
                assert(result.success_message === 'Team bound');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doBindAnonymous', () => {
        it('should bind anonymous team without error', () => {
            let promise = teams.bindAnonymous('fifa');
            promise.then((result) => {
                //console.log(result);
                assert(result.success_message === 'Team bound');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doListRoi', () => {
        it('should get the Roi without error', () =>{
            let promise = teams.listRoi('teamwithroi', 'marketwithroi', 'aresolutionid');
            promise.then((result) => {
                //console.log(JSON.stringify(result));
                assert(result.test_query.marketId === 'marketwithroi', 'Should have returned proper market');
                assert(result.test_query.resolutionId === 'aresolutionid', 'Should have returned proper resolution');
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
