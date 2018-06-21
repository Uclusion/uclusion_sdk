function Users(client) {

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
        return updatePromise.then((result) => { return result.data });
    };

    /**
     * Gets a user's definition given it's ID
     * @param userId
     * @returns {PromiseLike<T> | Promise<T>} the user's information
     */
    this.get = function (userId) {
        const path = 'users/' + userId;
        const getPromise = client.doGet(path);
        return getPromise.then((result) => { return result.data });
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
        return deletePromise.then((result) => { return result.data });
    }
}

module.exports = (client) => {
    let myUsers = new Users(client);
    return myUsers;
};
