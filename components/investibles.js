function Investibles(client){

    const dataResolver = (result) => { return result.data };

    /**
     * Closes investible and idea is accepted
     * @param marketId the market in which the investible is resolved
     * @param investibleId the id of the investible resolved
     * @returns {PromiseLike<T> | Promise<T>} result of the resolve
     */
    this.resolve = function (marketId, investibleId) {
        const path = 'markets/' + marketId + '/investibles/' + investibleId + '/resolve';
        const resolvePromise = client.doPatch(path);
        return resolvePromise.then(dataResolver);

    };

    /**
     * Subscribes or unsubscribes a user to an investible
     * @param marketId the market in which the investible is followed
     * @param investibleId the id of the investible followed
     * @param isRemove Unsubscribes if true
     * @returns {PromiseLike<T> | Promise<T>} result of the follow
     */
    this.follow = function(marketId, investibleId, isRemove)
    {
        const body = {
            remove: isRemove
        };
        const path = 'markets/' + marketId + '/investibles/' + investibleId + '/follow';
        const followPromise = client.doPatch(path, undefined, body);
        return followPromise.then(dataResolver);
    };

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
            categoryList: categoryList
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
            categoryList: categoryList
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
     * Updates investible once it's in a market
     * @param marketId the market that is updated with the investible
     * @param investibleId the id of the investible in the market
     * @returns {PromiseLike<T> | Promise<T>} result of updating market
     */
    this.updateMarket = function (marketId, investibleId) {
        const path = 'markets/' + marketId + '/investibles/' + investibleId;
        const updateMarketPromise = client.doPatch(path);
        return updateMarketPromise.then(dataResolver);
    };

    /**
     * Gets an investible once it's in a market
     * @param marketId the name of the market
     * @param investibleId the id of the investible in the market
     * @returns {PromiseLike<T> | Promise<T>} result of getting market
     */
    this.getMarket = function (marketId, investibleId) {
        const path = 'markets/' + marketId + '/investibles/' + investibleId;
        const getMarketPromise = client.doGet(path);
        return getMarketPromise.then(dataResolver);
    };


}

module.exports = (client) => {
    let myInvestibles = new Investibles(client);
    return myInvestibles;
};
