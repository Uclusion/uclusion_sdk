function Users(client) {

    const SUBDOMAIN = 'users';

    const dataResolver = (result) => { return result.data };
    /**
     * Updates the current user with the given name
     * @param name the new name of the user
     * @returns {PromiseLike<T> | Promise<T>} the result of the update
     */
    this.update = function(name) {
        const body = {
            name: name
        };
        const path = 'users';
        const updatePromise = client.doPatch(SUBDOMAIN, path, undefined, body);
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
        let path = 'users/';
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
     * Deletes the current user from uclusion
     * @param reason why the user is deleting themselves
     * @returns {PromiseLike<T> | Promise<T>} the result of the delete
     */
    this.delete = function (reason) {
        const path = 'users';
        const body = {
            reason: reason
        };
        const deletePromise = client.doDelete(SUBDOMAIN, path, undefined, body);
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
        const path = 'users/' + userId + '/transfer/'+ marketId;
        const transferPromise = client.doPatch(SUBDOMAIN, path, undefined, body);
        return transferPromise.then(dataResolver);
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
        const path = 'users/' + userId + '/grant/'+ marketId;
        const grantPromise = client.doPatch(SUBDOMAIN, path, undefined, body);
        return grantPromise.then(dataResolver);
    };

    /**
     * Grants an existing user and adds user to the market. If not existing or need email sent then use invite method
     * @param userId the user to grant them to - must be existing already for this method
     * @param marketId the market to grant the idea shares in
     * @param teamId Team to use in defining the users market capability
     * @param ideaSharesQuantity the quantity of idea shares to grant
     * @param isAdmin Whether to add the user to the market as an admin
     * @returns {PromiseLike<T> | Promise<T>} the result of the grant
     */
    this.grantAddExistingUserToMarket = function(userId, marketId, teamId, ideaSharesQuantity, isAdmin){
        const body = {
            quantity: ideaSharesQuantity,
            team_id: teamId,
            is_admin: isAdmin
        };
        const path = 'users/' + userId + '/grant/' + marketId;
        const grantPromise = client.doPatch(SUBDOMAIN, path, undefined, body);
        return grantPromise.then(dataResolver);
    };


}

let configuredUsers = (client) => {
    return new Users(client);
};
//module.exports = configuredUsers;
export default configuredUsers;