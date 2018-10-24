function Investibles(client){

    const SUBDOMAIN = 'investibles';

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
        const createPromise = client.doPost(SUBDOMAIN, 'create', undefined, body);
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
        const updatePromise = client.doPatch(SUBDOMAIN, investibleId, undefined, body);
        return updatePromise.then(dataResolver);
    };

    /**
     * Updates an investible with name, description, and categories
     * @param marketId Market that owns this investible
     * @param investibleId the id of the investible updated
     * @param investibleName name of investible
     * @param investibleDescription description of investible
     * @param categoryList list of categories
     * @returns {PromiseLike<T> | Promise<T>} result of updating investible
     */
    this.updateInMarket = function(investibleId, marketId, investibleName, investibleDescription, categoryList)
    {
        const body = {
            market_id: marketId,
            name: investibleName,
            description: investibleDescription,
            category_list: categoryList
        };
        const updatePromise = client.doPatch(SUBDOMAIN, investibleId, undefined, body);
        return updatePromise.then(dataResolver);
    };

    /**
     * Gets the investible with given id
     * @param investibleId the id of the investible
     * @returns {PromiseLike<T> | Promise<T>} result of getting investible
     */
    this.get = function(investibleId)
    {
        const getPromise = client.doGet(SUBDOMAIN, investibleId);
        return getPromise.then(dataResolver);
    };

    /**
     * Deletes investible with given id
     * @param investibleId id of the investible
     * @returns {*|PromiseLike<T>|Promise<T>} result of deleting investible
     */
    this.delete = function(investibleId)
    {
        const getPromise = client.doDelete(SUBDOMAIN, investibleId);
        return getPromise.then(dataResolver);
    };


    /**
     * Follows or unfollows the given investible in the given market
     * @param investibleId the id of the investible to follow/unfollow
     * @param stopFollowing whether or not to STOP following the investible.
     * @returns {PromiseLike<T> | Promise<T>} the result of the follow/unfollow
     */
    this.follow = function(investibleId, stopFollowing){
        let body = {};
        if(stopFollowing){
            body.remove = true;
        }
        const path = 'follow/' + investibleId;
        const followPromise = client.doPatch(SUBDOMAIN, path, undefined, body);
        return followPromise.then(dataResolver);
    };


    /**
     * Resolves the given investible within the given market
     * @param investibleId the id of the investible to resolve
     * @returns {PromiseLike<T> | Promise<T>} the result of the resolve
     */
    this.resolve = function(investibleId){
        const path = 'resolve/' + investibleId;
        const resolvePromise = client.doPatch(SUBDOMAIN, path);
        return resolvePromise.then(dataResolver);
    };

    /**
     * Listed investibles that a user has which are not bound to a market (ie draft or template)
     * @returns {PromiseLike<T> | Promise<T>}
     */
    this.listTemplates = function () {
        const getPromise = client.doGet(SUBDOMAIN, 'list');
        return getPromise.then(dataResolver);
    };

}

let configuredInvestibles = (client) => {
    return new Investibles(client);
};

export default configuredInvestibles;
