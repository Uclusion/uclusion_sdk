import { Users } from './components/users.js';
import { Markets } from './components/markets.js';
import { Investibles } from './components/investibles.js';
import { FetchClient } from './components/fetchClient.js';
import { Summaries } from './components/summaries';
import { SSO } from './components/sso';

function Uclusion() {

  /**
   * Constructs an api client from a given base endpoint url and a user token gotten from cognito
   * @param configuration a js object contaning baseURL, and the authorizor object which implements authorize and re-authorize, which return a promise
   * that resolves to the authorization token
   * @returns a promise that when resolved results in instantiated api client.
   */
  this.constructClient = (configuration) => {
    const transportClient = new FetchClient({ ...configuration });
    return authorizerPromise.then((userToken) => {
      return {
        users: new Users(transportClient),
        markets: new Markets(transportClient),
        investibles: new Investibles(transportClient),
        summaries: new Summaries(transportClient),
      };
    });
  };

  this.constructSSOClient = (configuration) => {
    //we don't use tokens for SSO, so just zero it out
    const transportClient = new FetchClient({ ...configuration, tokenManager: null});
    return Promise.resolve(new SSO(transportClient));
  }
}

let uclusion = new Uclusion();
export default uclusion;
