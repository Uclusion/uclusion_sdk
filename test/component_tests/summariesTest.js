import assert from 'assert';
import { serverCreator, clientCreator } from './testSetup';

const { app, server } = serverCreator();
import { Summaries } from '../../src/components/summaries.js';

let summaries = null;
app.get('/markets/bazaar', (request, response) => {
  response.json({ market_id: 'bazaar', summaries: [] });
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
      let promise = summaries.marketSummary('bazaar');
      promise.then((result) => {
        //console.log(result);
        assert(result.market_id === 'bazaar');
        assert(result.summaries.length === 0);
      }).catch((error) => {
        console.error(error);
      });
    });
  });
});
