import assert from 'assert';
import { serverCreator, clientCreator } from './testSetup';
const {app, server} = serverCreator();

app.get('/get/1234', (request, response) => {
    response.json({id: 1234});
});

app.delete('/delete', (request, response) => {
    response.json({success_message: 'User deleted'});
});

app.patch('/update', (request, response) => {
    response.json({success_message: 'User updated', test_body: request.body});
});

app.patch('/myUser/grant/n3wbie', (request, response) => {
    response.json({success_message: 'Granted', test_body: request.body});
});

app.patch('/testUser/grant/testMarket', (request, response) => {
    response.json({success_message: 'Granted Team', test_body: request.body});
});

import us from '../../src/components/users.js';
let users = null;

describe('Users', () => {
    before(() => {
        const client = clientCreator(server);
        users = us(client);
    });

    after(() => {
        server.close();
    });

    describe('#doGet', () => {
        it('should fetch user without error', () => {
            let promise = users.get('1234');
            promise.then((result) => {
                assert(result.id == '1234', "Client should have returned 1234 as it's ID");
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doDelete', () => {
        it('should delete without error', () => {
            users.delete('I hate uclusion so I\'m deleting myself')
                .then((result) => {
                    assert(result.success_message == 'User deleted');
                }).catch((error) => {
                console.error(error);
            });
        });
    });


    describe('#doGrant', () => {
        it('should grant user shares without error', () => {
            let promise = users.grant('myUser', 'n3wbie', 1090);
            promise.then((result) => {
                //console.log(result);
                assert(result.success_message == 'Granted');
                assert(result.test_body.quantity === 1090, 'Should have granted the proper amount');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doGrantAddExistingUserToMarket', () => {
        it('should grant user shares without error', () => {
            let promise = users.grantAddExistingUserToMarket('testUser', 'testMarket', 'ateam', 10902, true);
            promise.then((result) => {
                //console.log(result);
                assert(result.success_message == 'Granted Team');
                assert(result.test_body.quantity === 10902, 'Should have granted the proper amount');
                assert(result.test_body.team_id === 'ateam', 'Should have assigned the proper team');
                assert(result.test_body.is_admin, 'Should have specified an admin');

            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doPatch', () => {
        it('should update without error', () => {
            users.update('New Name')
                .then((result) => {
                    assert(result.success_message = 'User updated');
                    assert(result.test_body.name  == 'New Name', 'Body passed to server did not match expected');
                }).catch((error) => {
                console.error(error);
            });
        });
    });


});
