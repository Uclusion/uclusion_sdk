import { Users } from './components/users.js';
import { Markets } from './components/markets.js';
import { Investibles } from './components/investibles.js';
import { Teams } from './components/teams';
import { FetchClient } from './components/fetchClient.js';

function Uclusion() {

    /**
     * Constructs an api client from a given base endpoint url and a user token gotten from cognito
     * @param configuration a js object contaning baseURL, and the authorizor object which implements authorize and re-authorize, which return a promise
     * that resolves to the authorization token
     * @returns a promise that when resolved results in instantiated api client.
     */
    this.constructClient = (configuration) => {
        let transportClient = new FetchClient({baseURL: configuration.baseURL, authorizer: configuration.authorizer});
        let authorizerPromise = configuration.authorizer.authorize();
        return authorizerPromise.then((userToken) => {
             let apiClient = {
                users: new Users(transportClient),
                markets: new Markets(transportClient),
                investibles: new Investibles(transportClient),
                teams: new Teams(transportClient)
            };
            return apiClient;
        });
    };
}

let uclusion = new Uclusion();
export default uclusion;
