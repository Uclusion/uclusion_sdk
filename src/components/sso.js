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
     * @param isInvited True if we know this user is already invited to a workspace
     * @returns {PromiseLike<T> | Promise<T>} a user object and a Uclusion token login capability that is
     * automatically applied
     */
    this.accountCognitoLogin = function(idToken, isInvited) {
        const body = {
            id_token: idToken,
        };
        if (isInvited !== undefined && isInvited != null) {
            body.is_invited = isInvited;
        }
        const cognitoLoginPromise = client.doPost(SUBDOMAIN, 'cognito', undefined, body);
        return cognitoLoginPromise.then(dataResolver);
    };

    /**
     * Logs in to a market after account user already created. This method does not use an authorization header.
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
     * Logs in after a market holder Cognito identification on an invite.
     * @param idToken Cognito ID token with user identity
     * @param marketToken invite token being followed
     * @returns {PromiseLike<T> | Promise<T>} a user object and a Uclusion token login capability that is
     * automatically applied
     */
    this.marketInviteLogin = function(idToken, marketToken) {
        const body = {
            id_token: idToken,
            market_token: marketToken
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
     * Gets a user's own messages
     * @param idToken Cognito ID token
     * @returns {PromiseLike<T> | Promise<T>} list of messages
     */
    this.getMessages = function (idToken) {
        const getPromise = client.doGet(SUBDOMAIN, 'messages', {idToken});
        return getPromise.then(dataResolver);
    };

    /**
     * Gets a user's app version for his deployment group
     * @param idToken Cognito ID token
     * @returns {PromiseLike<T> | Promise<T>} list of messages
     */
    this.getAppVersion = function (idToken) {
        const getPromise = client.doGet(SUBDOMAIN, 'app', {idToken});
        return getPromise.then(dataResolver);
    };

    /**
     * Gets market info without logging into market
     * @param idToken Cognito ID token
     * @param marketId ID of the market to get
     * @returns {PromiseLike<T> | Promise<T>} market info
     */
    this.getMarketInfo = function (idToken, marketId) {
        const getPromise = client.doGet(SUBDOMAIN, 'info', {idToken, marketId});
        return getPromise.then(dataResolver);
    };

    /**
     * Gets market info without logging in
     * @param marketToken market invite capability
     * @returns {PromiseLike<T> | Promise<T>} market info
     */
    this.getMarketInfoForToken = function (marketToken) {
        const getPromise = client.doGet(SUBDOMAIN, 'marketinfo', {marketToken});
        return getPromise.then(dataResolver);
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

    /**
     * Signs the user up to the service.
     * @param signupData, the name, email, password, and phone number of the user
     * @param redirect an optional param of where the user wants to go after the signup process is complete
     * @returns if send code get back login data
     */
    this.userSignup = function(signupData, redirect) {
        const body = {
            ...signupData,
        };
        if (!body.phone || body.phone.length === 0) {
            delete body['phone']; // don't send phone if it's not present
        }
        if (!body.code || body.code.length === 0) {
            delete body['code']; // don't send code if it's not present
        }
        if (!body.email || body.email.length === 0) {
            delete body['email']; // don't send email if it's not present
        }
        if (redirect) {
            body['redirect'] = redirect;
        }
        const signupPromise = client.doPost(SUBDOMAIN, 'signup', undefined, body);
        return signupPromise.then(dataResolver);
    };

    /**
     * Resends the verification email to the user.
     * @param email The email of the user
     * @param redirect an optional param of where the user wants to go after the signup process is complete
     * @returns {PromiseLike<T> | Promise<T>}
     */
    this.resendVerification = function(email, redirect) {
        const body = {
            email,
        };
        if (redirect) {
            body['redirect'] = redirect;
        }
        const resendPromise = client.doPost(SUBDOMAIN, 'resendVerification', undefined, body);
        return resendPromise.then(dataResolver);
    };


    /**
     * Verifies the code the user presents.
     * The returned promise will have two keys "user_account" containing the account info, and "redirect"
     * containing a redirect partial url or the empty string
     * @param code the code we want to verify
     * @returns {PromiseLike<T> | Promise<T>}
     */
    this.verifyEmail = function(code) {
        const body = {
            code
        };
        const verifyPromise = client.doPost(SUBDOMAIN, 'verifyemail', undefined, body);
        return verifyPromise.then(dataResolver);
    }

}

export default SSO;