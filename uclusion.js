global.fetch = require('node-fetch') // dirty hack to fix node bug
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
    let initializeCognito = (poolId, clientId) => {
        const poolData = {UserPoolId: poolId, ClientId: clientId};
        let userPool = new CognitoUserPool(poolData);
        return userPool;
    };


    /**
     * Constructs an api client from a given base endpoint url and a user token gotten from cognito
     * @param apiBaseUrl the base url of the API endpoint
     * @param userToken the user's JWT token obtained from cognito
     * @returns an instantiated api client.
     */
    let setupClient = (apiBaseUrl, userToken) => {
        let transportClient = require('./components/axiosClient.js')({baseURL: apiBaseUrl});
        transportClient.setAuthorization(userToken);
        let apiClient = {
            user: require('components/users.js')(transportClient),
            market: require('components/markets.js')(transportClient)
        };
       // console.log(apiClient.user);
        return apiClient;
    };

    /**
     * Given a pool, username and password, attempts to log the user in
     * to the pool, with the username and password
     * @param cognitoPool the pool we are connecting to
     * @param username the username of the user we're authenticating
     * @param password the password of the user we're authenticating
     * @returns A Promise that will pass in the authentication result to resolve or reject
     */
    let authenticateUser = (cognitoPool, username, password) => {
        return new Promise((resolve, reject) =>
        {
            const authenticationData = {
                Username: username,
                Password: password
            };
            const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
            const userData = {
                Username: username,
                Pool: cognitoPool
            };
            const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (result) => { resolve(result) },
                onFailure: (error) => { reject(error) },
                newPasswordRequired: (userAttribute, requiredAttributes) => { reject({ newPasswordRequired: true, userAttribute: userAttribute, requiredAttributes: requiredAttributes }) }
            });
        });
    };

    /**
     * Constructs the client according to the configuration passed in.
     * @param configuration, an object with teh poolId, clientId, username, password, and baseURL set
     * @returns {PromiseLike<an> | Promise<an>} A promise that when resolved will return a fully instantiated client
     */
    this.constructClient = (configuration) => {
        const cognitoPool = initializeCognito(configuration.poolId, configuration.clientId);
        const promise = authenticateUser(cognitoPool, configuration.username, configuration.password);
        return promise.then((result) => {
            const currentUser = cognitoPool.getCurrentUser();
            const sessionPromise = new Promise((resolve, reject) => {
              currentUser.getSession((err, session) => {
                if(err){
                  reject(err);
                }
                resolve(session);
              });
            });
            return sessionPromise;
          }).then((session) => {
              const token = session.getIdToken().getJwtToken();
              return setupClient(configuration.baseURL, token);
            });

    };
}

module.exports = new Uclusion();
