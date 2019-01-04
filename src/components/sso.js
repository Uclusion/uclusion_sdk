export function Sso(client) {

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


}

export default Sso;