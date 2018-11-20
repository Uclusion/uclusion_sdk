export function Markets(client){

    const SUBDOMAIN = 'markets';

    const dataResolver = (result) => { return result.data };

    /**
      * Creates an investment in the given investible and market with the specified number
      * of idea ideaShares
      * @param marketId the id of the market to make the investment inspect
      * @param teamId the id of the team making the investment
      * @param investibleId the id of the investible to invest
      * @param ideaSharesQuantity the number of idea shares to investible
      * @returns {PromiseLike<T> | Promise<T>} the result of the investment
      */
    this.createInvestment = function(marketId, teamId, investibleId, ideaSharesQuantity){
        const body = {
            quantity: ideaSharesQuantity,
            investible_id: investibleId
        };
        const path = marketId + '/teams/' + teamId + '/invest';
        const createPromise = client.doPost(SUBDOMAIN, path, undefined, body);
        return createPromise.then(dataResolver);
    };
    /**
      * Deletes an investment in the given investible and market
      * @param marketId the id of the market to make the investment inspect
      * @param investmentId the id of the investible to invest inspect
      * @returns {PromiseLike<T> | Promise<T>} the result of the delete
      */
    this.deleteInvestment = function(marketId, investmentId){
        const path = marketId + '/investments/' + investmentId;
        const deletePromise = client.doDelete(SUBDOMAIN, path, undefined, undefined);
        return deletePromise.then(dataResolver);
    };

    /**
     * Creates a market with the given options. Options is an object with the following form
     * <ul>
     *  <li>name : string, <b>required</b></li>
     *  <li>description: string, <b>required</b></li>
     *  <li>trending_window: number</li>
     *  <li>manual_roi: boolean</li>
     * </ul>
     * @param marketOptions the options for the market
     * @returns {PromiseLike<T> | Promise<T>} the result of the create
     */
    this.createMarket = function(marketOptions){
        const createPromise = client.doPost(SUBDOMAIN, 'create', undefined, marketOptions);
        return createPromise.then(dataResolver);
    };

    /**
     * Retrieves the market with the given Id.
     * @param marketId the id of the market to return
     * @returns {PromiseLike<T> | Promise<T>} the result of the retrieval
     */
    this.get = function(marketId){
        const getPromise = client.doGet(SUBDOMAIN, marketId);
        return getPromise.then(dataResolver);
    };

    /**
     * Updates a market with the given options. Options is an object with the following form
     * <ul>
     *  <li>name : string, <b>required</b></li>
     *  <li>description: string, <b>required</b></li>
     *  <li>trending_window: number, <b>required</b></li>
     * </ul>
     * @param marketId Market to update
     * @param marketUpdateOptions the options for the market
     * @returns {PromiseLike<T> | Promise<T>} the result of the update
     */
    this.updateMarket = function(marketId, marketUpdateOptions){
        const updatePromise = client.doPatch(SUBDOMAIN, marketId, undefined, marketUpdateOptions);
        return updatePromise.then(dataResolver);
    };

    this.deleteMarket = function(marketId){
        const getPromise = client.doDelete(SUBDOMAIN, marketId, undefined, undefined);
        return getPromise.then(dataResolver);
    };


    /**
     * Follows or unfollows the given market
     * @param marketId the market id to follow/unfollow
     * @param stopFollowing whether or not to STOP following the market.
     * @returns {PromiseLike<T> | Promise<T>} the result of the follow/unfollow
     */
    this.followMarket = function(marketId, stopFollowing){
        let body = {};
        if(stopFollowing){
            body.remove = true;
        }
        const path = 'follow/' + marketId;
        const followPromise = client.doPatch(SUBDOMAIN, path, undefined, body);
        return followPromise.then(dataResolver);
    };

    /**
     * Fetches the given market investible from the given market
     * @param marketId the id of the market to retrieve the investible in
     * @param investibleId the id of the investible to retrieve
     * @returns {PromiseLike<T> | Promise<T>} the result of the fetch
     */
    this.getMarketInvestible = function(marketId, investibleId){
        const path = marketId + '/investibles/' + investibleId;
        const getPromise = client.doGet(SUBDOMAIN, path);
        return getPromise.then(dataResolver);
    };

    this.listCategories = function (marketId) {
        const path = 'list/' + marketId;
        const getPromise = client.doGet(SUBDOMAIN, path, {type: 'categories'});
        return getPromise.then(dataResolver)
    };

    this.listCategoriesInvestibles = function (marketId, category, pageNumber, pageSize) {
        const path = 'list/' + marketId;
        const getPromise = client.doGet(SUBDOMAIN, path, {type: 'categoryInvestibles', category: category, currentPage: pageNumber, pageSize: pageSize});
        return getPromise.then(dataResolver);
    };

    this.listInvestibleInvestments = function (marketId, investibleId, pageNumber, pageSize, trendingWindowDate) {
        const path = 'list/' + marketId;
        const getPromise = client.doGet(SUBDOMAIN, path, {type: 'investibleInvestments', investibleId: investibleId, currentPage: pageNumber, pageSize: pageSize, trendingWindowDate: trendingWindowDate});
        return getPromise.then(dataResolver);
    };

    this.listInvestiblePresences = function (marketId) {
        const path = 'list/' + marketId;
        const getPromise = client.doGet(SUBDOMAIN, path, {type: 'investiblePresences'});
        return getPromise.then(dataResolver);
    };

    this.listInvestibles = function (marketId, searchString, currentPage, pageSize) {
        const path = 'list/' + marketId;
        const getPromise = client.doGet(SUBDOMAIN, path, {type: 'investibles', searchString: searchString, currentPage: currentPage, pageSize: pageSize});
        return getPromise.then(dataResolver);
    };

    this.listTrending = function (marketId, trendingWindowDate) {
        const path = 'list/' + marketId;
        const getPromise = client.doGet(SUBDOMAIN, path, {type: 'trending', trendingWindowDate: trendingWindowDate});
        return getPromise.then(dataResolver);
    };

    this.listUserInvestments = function (marketId, userId, pageSize, lastEvaluatedKey) {
        const path = 'list/' + marketId;
        let queryParams = {type: 'userInvestments', userId: userId, pageSize: pageSize};
        if (lastEvaluatedKey) {
            queryParams.lastEvaluatedKey = lastEvaluatedKey;
        }
        const getPromise = client.doGet(SUBDOMAIN, path, queryParams);
        return getPromise.then(dataResolver);
    };
}

export default Markets;
