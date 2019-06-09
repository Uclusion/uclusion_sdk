import assert from 'assert';
import { serverCreator, clientCreator } from './testSetup';

const { app, server } = serverCreator();
import { Summaries } from '../../src/components/summaries.js';

let summaries = null;
app.get('/get', (request, response) => {
  response.json({ summaries: [] });
});


describe('Summaries', () => {
  before(() => {
    const client = clientCreator(server);
    summaries = new Summaries(client);
  });

  after(() => {
    server.close();
  });

  describe('#doMarket', () => {
    it('should fetch market summaries without error', () => {
      let promise = summaries.marketSummary();
      promise.then((result) => {
        //console.log(result);
        assert(result.summaries.length === 0);
      }).catch((error) => {
        console.error(error);
      });
    });
  });
});
