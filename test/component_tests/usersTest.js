import assert from 'assert';
import { serverCreator, clientCreator } from './testSetup';

const { app, server } = serverCreator();

app.delete('/leave', (request, response) => {
  response.json({success_message: 'Left'});
});

app.delete('/removenotification', (request, response) => {
  response.json({success_message: 'Removed', test_query: request.query});
});

app.get('/get/1234', (request, response) => {
  response.json({ id: '1234' });
});

app.patch('/update', (request, response) => {
  response.json({ success_message: 'User updated', test_body: request.body });
});

app.patch('/myUser/grant', (request, response) => {
  response.json({ success_message: 'Granted', test_body: request.body });
});

import { Users } from '../../src/components/users.js';

let users = null;

describe('Users', () => {
  before(() => {
    const client = clientCreator(server);
    users = new Users(client);
  });

  after(() => {
    server.close();
  });

  describe('#doGet', () => {
    it('should fetch user without error', () => {
      let promise = users.get('1234');
      promise.then((result) => {
        assert(result.id === '1234', "Client should have returned 1234 as it's ID");
      }).catch((error) => {
        console.error(error);
      });
    });
  });

  describe('#doLeave', () => {
    it('should delete without error', () => {
      users.leave('I hate uclusion so I\'m leaving')
        .then((result) => {
          assert(result.success_message === 'Left');
        }).catch((error) => {
        console.error(error);
      });
    });
  });

  describe('#removeNotifications', () => {
    it('only sends the AI-dismissal intent when requested', async () => {
      const ordinary = await users.removeNotifications(['NOTICE_one']);
      assert.strictEqual(ordinary.test_query.dismiss_ai_generated, undefined);

      const jobSweep = await users.removeNotifications(['NOTICE_two'], true);
      assert.strictEqual(jobSweep.test_query.dismiss_ai_generated, 'true');
    });
  });


  describe('#doGrant', () => {
    it('should grant user shares without error', () => {
      let promise = users.grant('myUser', 1090);
      promise.then((result) => {
        //console.log(result);
        assert(result.success_message === 'Granted');
        assert(result.test_body.quantity === 1090, 'Should have granted the proper amount');
      }).catch((error) => {
        console.error(error);
      });
    });
  });

  describe('#doPatch', () => {
    it('should update without error', () => {
      let promise = users.update('New Name');
      promise.then((result) => {
        assert(result.success_message = 'User updated');
        assert(result.test_body.name === 'New Name', 'Body passed to server did not match expected');
      }).catch((error) => {
        console.error(error);
      });
    });
  });
});
