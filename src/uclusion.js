import { Users } from './components/users.js';
import { Markets } from './components/markets.js';
import { Investibles } from './components/investibles.js';
import { Teams } from './components/teams.js';
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
    const transportClient = new FetchClient({ baseURL: configuration.baseURL, authorizer: configuration.authorizer });
    const authorizerPromise = configuration.authorizer.authorize();
    return authorizerPromise.then((userToken) => {
      //console.log("Got user token:" + userToken)
      const apiClient = {
        users: new Users(transportClient),
        markets: new Markets(transportClient),
        investibles: new Investibles(transportClient),
        teams: new Teams(transportClient),
        summaries: new Summaries(transportClient),
      };
      return apiClient;
    });
  };

  this.constructSSOClient = (configuration) => {
    // sso calls are _not_ provided with uclusion tokens, hence we just return an empty token to the fetch client
    function EmptyAuthorizer() {
/*      this.authorize = () => {
        return Promise.resolve('');
      };
*/
      this.getToken = () => {
        return '';
      };
    }

    const transportClient = new FetchClient({ ...configuration, authorizer: new EmptyAuthorizer()});
    return Promise.resolve(new SSO(transportClient));
  }
}

let uclusion = new Uclusion();
export default uclusion;
