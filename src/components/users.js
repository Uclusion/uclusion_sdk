export function Users(client) {

    const SUBDOMAIN = 'users';

    const dataResolver = (result) => { return result.data };
    /**
     * Updates the current user with the given name
     * @param name the new name of the user
     * @param defaultMarketId Market ID to use for a user get when not specified
     * @param defaultTeamId Team ID to use for a user get when not specified
     * @returns {PromiseLike<T> | Promise<T>} the result of the update
     */
    this.update = function(name, defaultMarketId, defaultTeamId) {
        const body = {
            name: name
        };
        if (defaultMarketId) {
            body.default_market_id = defaultMarketId;
        }
        if (defaultTeamId) {
            body.default_team_id = defaultTeamId;
        }
        const updatePromise = client.doPatch(SUBDOMAIN, 'update', undefined, body);
        return updatePromise.then(dataResolver);
    };

    /**
     * Gets a user's definition given it's ID or null for invoking user
     * @param userId which can be null to get yourself
     * @param marketId Market to pull user data from - defaults if not set and user has at least one market
     * @param teamId Team to pull data from - defaults if not set
     * @returns {PromiseLike<T> | Promise<T>} the user's information
     */
    this.get = function (userId, marketId, teamId) {
        let path = 'get/';
        if (userId) {
            path += userId;
        }
        let queryParams = {};
        if (marketId) {
            queryParams.marketId = marketId;
        }
        if (teamId) {
            queryParams.teamId = teamId;
        }
        const getPromise = client.doGet(SUBDOMAIN, path, queryParams);
        return getPromise.then(dataResolver);
    };

    /**
     * Gets a user's presences, team and market tree, given ID or empty for invoking user
     * @param userId which can be empty to get yourself
     * @returns {PromiseLike<T> | Promise<T>} the user's information
     */
    this.getPresences = function (userId) {
        let path = 'presences/';
        if (userId) {
            path += userId;
        }
        const getPromise = client.doGet(SUBDOMAIN, path);
        return getPromise.then(dataResolver);
    };

    /**
     * Deletes the current user from uclusion
     * @param reason why the user is deleting themselves
     * @returns {PromiseLike<T> | Promise<T>} the result of the delete
     */
    this.delete = function (reason) {
        const body = {
            reason: reason
        };
        const deletePromise = client.doDelete(SUBDOMAIN, 'delete', undefined, body);
        return deletePromise.then(dataResolver);
    };

    /**
     * Transfers the given number of idea shares in the given market from one share holder to another
     * @param userId the user to grant them to
     * @param marketId the market to grant the idea shares in
     * @param ideaSharesQuantity the quantity of idea shares to grant
     * @param grantingUserId the share holder to transfer the idea shares from
     * @param teamId Must be specified if permissions for the transfer come from the team
     * @returns {PromiseLike<T> | Promise<T>} the result of the grant
     */
    this.transfer = function(grantingUserId, userId, marketId, ideaSharesQuantity, teamId){
        const body = {
            quantity: ideaSharesQuantity,
            granting_user_id: grantingUserId
        };
        if (teamId) {
            body.team_id = teamId;
        }
        const path = userId + '/transfer/'+ marketId;
        const transferPromise = client.doPatch(SUBDOMAIN, path, undefined, body);
        return transferPromise.then(dataResolver);
    };

    /**
     * Creates a new user from a magic link and identification
     * @param idToken OIDC ID token
     * @param email used if no idToken
     * @param name optional when using email instead of idToken
     * @returns {PromiseLike<T> | Promise<T>} the new user and an already consumed login capability
     */
    this.register = function(idToken, email, name){
        const body = {};
        if (idToken) {
            body.id_token = idToken;
        }
        if (email) {
            body.email = email;
        }
        if (name) {
            body.name = name;
        }
        const registerPromise = client.doPost(SUBDOMAIN, 'register', undefined, body);
        return client.setToken(registerPromise.then(dataResolver));
    };

    /**
     * Grants the given number of idea shares in the given market to the given user
     * @param userId the user to grant them to
     * @param marketId the market to grant the idea shares in
     * @param ideaSharesQuantity the quantity of idea shares to grant
     * @returns {PromiseLike<T> | Promise<T>} the result of the grant
     */
    this.grant = function(userId, marketId, ideaSharesQuantity){
        const body = {
            quantity: ideaSharesQuantity
        };
        const path = userId + '/grant/'+ marketId;
        const grantPromise = client.doPatch(SUBDOMAIN, path, undefined, body);
        return grantPromise.then(dataResolver);
    };
}

export default Users;