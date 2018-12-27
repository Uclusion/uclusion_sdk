export function Sso(client) {

    const SUBDOMAIN = 'sso';

    const dataResolver = (result) => { return result.data };

    /**
     * Redirects to an OIDC endpoint authorization with parameters on the redirect for the OIDC redirect and account
     * creation. This method does not use an authorization header.
     * @param accountName the new name of the new account
     * @param teamName name of the team that will own the account
     * @param teamDescription description of the team that will own the account
     * @param oidcOptions options used for OIDC authorization. Of the form
     * <ul>
     *  <li>op_endpoint_base_url: string, <b>required</b></li>
     *  <li>uclusion_client_id: string, <b>required</b></li>
     *  <li>destination_url: string, <b>required</b></li>
     * </ul>
     * @returns {PromiseLike<T> | Promise<T>} a redirect to OIDC authorizaton with correct query params
     */
    this.accountCreateAuthRedirect = function(accountName, teamName, teamDescription, oidcOptions) {
        const body = {
            account_name: accountName,
            team_name: teamName,
            team_description: teamDescription,
            op_endpoint_base_url: oidcOptions.op_endpoint_base_url,
            uclusion_client_id: oidcOptions.uclusion_client_id,
            destination_url: oidcOptions.destination_url
        };
        const oidcPreAccountPromise = client.doPost(SUBDOMAIN, 'oidcpre', undefined, body);
        return oidcPreAccountPromise.then(dataResolver);
    };

    /**
     * Redirects to an OIDC authorization with parameters on the redirect.
     * @param accountId account ID that will be given access to after login
     * @param destinationUrl page to send the user back to after authorization
     * @returns {PromiseLike<T> | Promise<T>} a redirect to OIDC authorizaton with correct query params
     */
    this.oidcAuthRedirect = function(accountId, destinationUrl) {
        const body = {
            destination_url: destinationUrl,
            account_id: accountId
        };
        const oidcPrePromise = client.doPost(SUBDOMAIN, 'prelogin', undefined, body);
        return oidcPrePromise.then(dataResolver);
    };

    /**
     * Redirects to a product authorization with parameters on the redirect.
     * @param marketId market ID that will be given access to after login
     * @param destinationUrl page to send the user back to after authorization
     * @param referringUserId Optional magic link referring user ID
     * @param referringTeamId Optional magic link referring team ID
     * @returns {PromiseLike<T> | Promise<T>} a redirect to product authorizaton with correct query params
     */
    this.externalAuthRedirect = function(marketId, destinationUrl, referringUserId, referringTeamId) {
        const body = {
            destination_url: destinationUrl,
            market_id: marketId
        };
        if (referringUserId) {
            body.referring_user_id = referringUserId;
        }
        if (referringTeamId) {
            body.referring_team_id = referringTeamId;
        }
        const externalPrePromise = client.doPost(SUBDOMAIN, 'prelogin', undefined, body);
        return externalPrePromise.then(dataResolver);
    };

    /**
     * Creates an account with the information collected from accountCreateAuthRedirect. This method does not use an
     * authorization header.
     * @param idToken OIDC ID token with account creator's identity
     * @param state token with all information passed from accountCreateAuthRedirect
     * @returns {PromiseLike<T> | Promise<T>} a user object and a Uclusion token login capability that is
     * automatically applied
     */
    this.createAccount = function(idToken, state) {
        const body = {
            id_token: idToken,
            state: state
        };
        const accountPromise = client.doPost(SUBDOMAIN, 'create', undefined, body);
        return client.setToken(accountPromise.then(dataResolver));
    };

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
        return client.setToken(oidcLoginPromise.then(dataResolver));
    };

    /**
     * Logs in after an external product authorization. This method does not use an authorization header.
     * @param externalAuthToken external token with user identity and team info
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
        return client.setToken(marketLoginPromise.then(dataResolver));
    };
}

export default Sso;