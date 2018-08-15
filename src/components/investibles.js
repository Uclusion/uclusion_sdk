function Investibles(client){

    const dataResolver = (result) => { return result.data };

    /**
     * Creates an investible
     * @param investibleName name of investible
     * @param investibleDescription description of investible
     * @param categoryList list of categories
     * @returns {PromiseLike<T> | Promise<T>} result of creating an investible
     */
    this.create = function(investibleName, investibleDescription, categoryList)
    {
        const body = {
            name: investibleName,
            description: investibleDescription,
            category_list: categoryList
        };
        const path = 'investibles';
        const createPromise = client.doPost(path, undefined, body);
        return createPromise.then(dataResolver);
    };

    /**
     * Updates an investible with name, description, and categories
     * @param investibleId the id of the investible updated
     * @param investibleName name of investible
     * @param investibleDescription description of investible
     * @param categoryList list of categories
     * @returns {PromiseLike<T> | Promise<T>} result of updating investible
     */
    this.update = function(investibleId, investibleName, investibleDescription, categoryList)
    {
        const body = {
            name: investibleName,
            description: investibleDescription,
            category_list: categoryList
        };
        const path = 'investibles/' + investibleId;
        const updatePromise = client.doPatch(path, undefined, body);
        return updatePromise.then(dataResolver);
    };

    /**
     * Gets the investible with given id
     * @param investibleId the id of the investible
     * @returns {PromiseLike<T> | Promise<T>} result of getting investible
     */
    this.get = function(investibleId)
    {
        const path = 'investibles/' + investibleId;
        const getPromise = client.doGet(path);
        return getPromise.then(dataResolver);
    };

    /**
     * Deletes investible with given id
     * @param investibleId id of the investible
     * @returns {*|PromiseLike<T>|Promise<T>} result of deleting investible
     */
    this.delete = function(investibleId)
    {
        const path = 'investibles/' + investibleId;
        const getPromise = client.doDelete(path);
        return getPromise.then(dataResolver);
    };

}

let configuredInvestibles = (client) => {
    let myInvestibles = new Investibles(client);
    return myInvestibles;
};

export default configuredInvestibles;
