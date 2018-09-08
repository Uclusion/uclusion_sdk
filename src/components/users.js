function Users(client) {

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
        const updatePromise = client.doPatch(path, undefined, body);
        return updatePromise.then(dataResolver);
    };

    /**
     * Gets a user's definition given it's ID or null for invoking user
     * @param userId which can be null to get yourself
     * @returns {PromiseLike<T> | Promise<T>} the user's information
     */
    this.get = function (userId) {
        let path = 'users/';
        if (userId) {
            path += userId;
        }
        const getPromise = client.doGet(path);
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
        const deletePromise = client.doDelete(path, undefined, body);
        return deletePromise.then(dataResolver);
    }
}

let configuredUsers = (client) => {
    let myUsers = new Users(client);
    return myUsers;
};
//module.exports = configuredUsers;
export default configuredUsers;