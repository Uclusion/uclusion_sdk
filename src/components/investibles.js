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
     * @param marketId the market id to follow/unfollow the investible in
     * @param stopFollowing whether or not to STOP following the investible.
     * @returns {PromiseLike<T> | Promise<T>} the result of the follow/unfollow
     */
    this.follow = function(investibleId, marketId, stopFollowing){
        let body = {};
        if(stopFollowing){
            body.remove = true;
        }
        const path = investibleId + '/follow/' + marketId;
        const followPromise = client.doPatch(SUBDOMAIN, path, undefined, body);
        return followPromise.then(dataResolver);
    };


    /**
     * Resolves the given investible within the given market
     * @param investibleId the id of the investible to resolve
     * @param marketId the id of the market to resolve the investible in
     * @returns {PromiseLike<T> | Promise<T>} the result of the resolve
     */
    this.resolve = function(investibleId, marketId){
        const path = investibleId + '/resolve/' + marketId ;
        const resolvePromise = client.doPatch(SUBDOMAIN, path);
        return resolvePromise.then(dataResolver);
    };

    /**
     * Listed investibles that a user has which are not bound to a market (ie draft or template)
     * @param userId User whose templates will be listed
     * @returns {PromiseLike<T> | Promise<T>}
     */
    this.listTemplates = function (userId) {
        const path = 'list/' + userId;
        const getPromise = client.doGet(SUBDOMAIN, path);
        return getPromise.then(dataResolver);
    };

}

let configuredInvestibles = (client) => {
    return new Investibles(client);
};

export default configuredInvestibles;
