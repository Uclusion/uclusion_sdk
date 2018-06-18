const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

function Uclusion() {

    /**
     * Initializes the congnito user system with the given pool ID and client id.
     * With the initialized pool you can authenticate your user, and then pass the
     * user authenticated user's token innto constructClient
     * @param poolId the id of the pool you want to connect to
     * @param clientId your client id for the pool
     * @returns {AmazonCognitoIdentity.CognitoUserPool} a configured cognito user pool
     */
    this.initializeCognito = (poolId, clientId) => {
        const poolData = {UserPoolId: poolId, ClientId: clientId};
        let userPool = new CognitoUserPool(poolData);
        return userPool;
    };

    /**
     * Constructs an api client from a given base endpoint url and a user token gotten from cognito
     * @param apiBaseUrl the base url of the API endpoint
     * @param userToken the user's JWT token obtained from cognito
     */
    this.constructClient = (apiBaseUrl, userToken) => {
        let apiClient = () => {
            let transportClient = require('components/client.js')({baseURL: apiBaseUrl});
            transportClient.setAuthorization(userToken);
            apiClient.user = require('components/user.js')(transportClient);
        }
    };
}

module.export = new Uclusion();
