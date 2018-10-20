import a_users from './components/users.js';
import a_markets from './components/markets.js';
import a_investibles from './components/investibles.js';
import a_teams from './components/teams';
import a_client from './components/fetchClient.js';

function Uclusion() {

    /**
     * Constructs an api client from a given base endpoint url and a user token gotten from cognito
     * @param configuration a js object contaning baseURL, and the authorizor object which returns a promise
     * that resolves to the authorization token
     * @returns a promise that when resolved results in instantiated api client.
     */
        this.constructClient = (configuration) => {
        let transportClient = a_client({baseURL: configuration.baseURL});
        let authorizerPromise = configuration.authorizer.authorize();
        return authorizerPromise.then((userToken) => {
            transportClient.setAuthorization(userToken);
            let apiClient = {
                users: a_users(transportClient),
                markets: a_markets(transportClient),
                investibles: a_investibles(transportClient)
                teams: a_teams(transportClient);
            };
            //console.log(apiClient.user);
            return apiClient;
        });
    };
}

let uclusion = new Uclusion();
export default uclusion;
