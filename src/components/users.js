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
    }
}

let configuredUsers = (client) => {
    return new Users(client);
};
//module.exports = configuredUsers;
export default configuredUsers;