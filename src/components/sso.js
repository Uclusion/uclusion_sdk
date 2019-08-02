import { dataResolver } from './utils';

export function SSO(client){

    const SUBDOMAIN = 'sso';

    /**
     * Logs in after an OIDC authorization. This method does not use an authorization header.
     * @param idToken OIDC ID token with user identity
     * @param state token with all information passed from oidcAuthRedirect
     * @returns {PromiseLike<T> | Promise<T>} a user object and a Uclusion token login capability that is
     * automatically applied
     */
    this.accountLogin = function(idToken, state) {
        const body = {
            id_token: idToken,
            state: state
        };
        const oidcLoginPromise = client.doPost(SUBDOMAIN, 'login', undefined, body);
        return oidcLoginPromise.then(dataResolver);
    };

    /**
     * Logs in after an account holder Cognito identification. This method does not use an authorization header.
     * @param idToken Cognito ID token with user identity
     * @param accountId an account ID of the user
     * @returns {PromiseLike<T> | Promise<T>} a user object and a Uclusion token login capability that is
     * automatically applied
     */
    this.accountCognitoLogin = function(idToken, accountId) {
        const body = {
            id_token: idToken,
            account_id: accountId
        };
        const cognitoLoginPromise = client.doPost(SUBDOMAIN, 'cognito', undefined, body);
        return cognitoLoginPromise.then(dataResolver);
    };

    /**
     * Logs in after a market holder Cognito identification. This method does not use an authorization header.
     * @param idToken Cognito ID token with user identity
     * @param marketId a market ID of the user
     * @returns {PromiseLike<T> | Promise<T>} a user object and a Uclusion token login capability that is
     * automatically applied
     */
    this.marketCognitoLogin = function(idToken, marketId) {
        const body = {
            id_token: idToken,
            market_id: marketId
        };
        const cognitoLoginPromise = client.doPost(SUBDOMAIN, 'cognito', undefined, body);
        return cognitoLoginPromise.then(dataResolver);
    };

    /**
     * Redirects to an OIDC authorization with parameters on the redirect.
     * @param marketId account ID that will be given access to after login
     * @param destinationUrl page to send the user back to after authorization
     * @param redirectUrl The url to redirect the user to after auth. Only valid in dev envs
     * @returns {PromiseLike<T> | Promise<T>} a redirect to OIDC authorizaton with correct query params
     */
     this.oidcAuthRedirect = function(marketId, destinationUrl, redirectUrl) {
        const body = {
            destination_page: destinationUrl,
            redirect_url: redirectUrl,
            market_id: marketId
        };
        const oidcPrePromise = client.doPost(SUBDOMAIN, 'oidcprelogin', undefined, body);
        return oidcPrePromise.then(dataResolver);
    };

    /**
     * Initial account creation. This method does not use an authorization header.
     * @param idToken OIDC ID token with user identity
     * @param state token with all information passed from oidcAccountRedirect
     * @returns {PromiseLike<T> | Promise<T>} a user object and a Uclusion token login capability
     */
    this.accountCreate = function(idToken, state) {
        const body = {
            id_token: idToken,
            state: state
        };
        const oidcCreatePromise = client.doPost(SUBDOMAIN, 'create', undefined, body);
        return oidcCreatePromise.then(dataResolver);
    };

    /**
     * Initial account creation. This method does not use an authorization header.
     * @param accountName Name of account
     * @param idToken OIDC ID token with user identity
     * @param tier - Free, Advanced, etc.
     * @param disableExisting - true if want any existing account disabled instead of error
     * @returns {PromiseLike<T> | Promise<T>} a user object and a Uclusion token login capability
     */
    this.cognitoAccountCreate = function(accountName, idToken, tier, disableExisting) {
        const body = {
            account_name: accountName,
            id_token: idToken,
            tier: tier
        };
        if (disableExisting) {
            body.disable_existing = disableExisting;
        }
        const cognitoCreatePromise = client.doPost(SUBDOMAIN, 'cognitocreate', undefined, body);
        return cognitoCreatePromise.then(dataResolver);
    };

    /**
     * Initial user creation. This method does not use an authorization header.
     * @param creationToken Signed token
     * @param name of user creating the account
     * @param email of user creating the account for later login
     * @returns {PromiseLike<T> | Promise<T>} a user object and a Uclusion token login capability
     */
    this.cognitoUserCreate = function(name, email, creationToken) {
        const body = {
            name: name,
            email: email,
            creation_token: creationToken,
        };
        const cognitoCreatePromise = client.doPost(SUBDOMAIN, 'usercreate', undefined, body);
        return cognitoCreatePromise.then(dataResolver);
    };

    /**
     * Initial user creation. This method does not use an authorization header.
     * @param marketId market signing up for
     * @param name of user creating the account
     * @param email of user creating the account for later login
     * @returns {PromiseLike<T> | Promise<T>} a user object and a Uclusion token login capability
     */
    this.cognitoUserSignup = function(marketId, name, email) {
        const body = {
            name: name,
            email: email
        };
        const cognitoCreatePromise = client.doPost(SUBDOMAIN, marketId, undefined, body);
        return cognitoCreatePromise.then(dataResolver);
    };

    /**
     * Redirects to an OIDC authorization with parameters on the redirect.
     * <ul>
     *  <li>account_name: string</li>
     *  <li>op_endpoint_base_url: string</li>
     *  <li>uclusion_client_id: string</li>
     *  <li>redirect_url: string</li>
     *  <li>oidc_type: enum</li>
     * </ul>
     * @returns {PromiseLike<T> | Promise<T>} a redirect to account creation with correct query params
     */
    this.accountRedirect = function(accountOptions) {
        const oidcPrePromise = client.doPost(SUBDOMAIN, 'oidcpre', undefined, accountOptions);
        return oidcPrePromise.then(dataResolver);
    };

    /**
     * Logs in after an external product authorization. This method does not use an authorization header.
     * @param externalAuthToken external token with user identity
     * @param state token with all information passed from externalAuthRedirect
     * @returns {PromiseLike<T> | Promise<T>} a user object and a Uclusion token login capability that is
     * automatically applied
     */
    this.marketLogin = function(externalAuthToken, state) {
        const body = {
            external_auth_token: externalAuthToken,
            state: state
        };
        const marketLoginPromise = client.doPost(SUBDOMAIN, 'login', undefined, body);
        return marketLoginPromise.then(dataResolver);
    };

    /**
     * Logs in anonymously - read only. This method does not use an authorization header.
     * @param marketId Market ID of a market allowing anonymous login
     * @returns {PromiseLike<T> | Promise<T>} a user object and a Uclusion token login capability that is
     * automatically applied
     */
    this.marketAnonymousLogin = function(marketId) {
        const body = {
            market_id: marketId
        };
        const marketLoginPromise = client.doPost(SUBDOMAIN, 'anonymous', undefined, body);
        return marketLoginPromise.then(dataResolver);
    };

    /**
     * Information about available types of login for this market. This method does not use an authorization header.
     * @param marketId Market ID of a market to check for anonymous and Cognito logins availability
     * @returns {PromiseLike<T> | Promise<T>} a dictionary of login info
     */
    this.marketLoginInfo = function(marketId) {
        const marketLoginInfoPromise = client.doGet(SUBDOMAIN, marketId, undefined);
        return marketLoginInfoPromise.then(dataResolver);
    };


    /**
     * Information about available market logins for the email in the idToken. This method does not use an authorization header.
     * @param idToken Cognito ID token
     * @returns {PromiseLike<T> | Promise<T>} a dictionary of login info keyed by market IDs
     */
    this.emailLoginInfo = function(idToken) {
        const loginsInfoPromise = client.doGet(SUBDOMAIN, 'info', {idToken});
        return loginsInfoPromise.then(dataResolver);
    };

    /**
     * Redirects to a product authorization with parameters on the redirect.
     * @param marketId market ID that will be given access to after login
     * @param destinationUrl page to send the user back to after authorization
     * @param redirectUrl The url to redirect the user to after auth. Only valid in dev envs
     * @param referringUserId Optional magic link referring user ID
     * @returns {PromiseLike<T> | Promise<T>} a redirect to product authorizaton with correct query params
     */
    this.externalAuthRedirect = function(marketId, destinationUrl, redirectUrl, referringUserId) {
        const body = {
            destination_page: destinationUrl,
            redirect_url: redirectUrl,
            market_id: marketId
        };
        if (referringUserId) {
            body.referring_user_id = referringUserId;
        }
        const externalPrePromise = client.doPost(SUBDOMAIN, 'ssoprelogin', undefined, body);
        return externalPrePromise.then(dataResolver);
    };


}

export default SSO;