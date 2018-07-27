function Markets(client){

    const dataResolver = (result) => { return result.data };
    /**
     * Invites a user, identified by email, to the given market, and assigns them a quantity of idea shares
     * @param marketId the market to invite the user to
     * @param email the email of the user to invitere
     * @returns the result of inviting the user
     */
    this.invite = function(marketId, email, ideaSharesQuantity){
        const body = {
            email: email,
            quantity: ideaSharesQuantity
        };
        const path = 'markets/' + marketId + '/invite';
        const invitePromise = client.doPost(path, undefined, body);
        return invitePromise.then(dataResolver);
    };

    /**
     * Grants the given number of idea shares in the given market to the given user
     * @param marketId the market to grant the idea shares in
     * @param userId the user to grant them to
     * @param ideaSharesQuantity the quantity of idea shares to grant
     * @returns {PromiseLike<T> | Promise<T>} the result of the grant
     */
    this.grant = function(marketId, userId, ideaSharesQuantity){
        const body = {
            quantity: ideaSharesQuantity
        };
        const path = 'markets/' + marketId + '/users/' + userId + '/grant';
        const grantPromise = client.doPatch(path, undefined, body);
        return grantPromise.then(dataResolver);
    };

    /**
      * Creates an investment in the given investible and market with the specified number
      * of idea ideaShares
      * @param marketId the id of the market to make the investment inspect
      * @param investibleId the id of the investible to invest inspect
      * @param ideaSharesQuantity the number of idea shares to investible
      * @returns {PromiseLike<T> | Promise<T>} the result of the investment
      */
    this.createInvestment = function(marketId, investibleId, ideaSharesQuantity){
        const body = {
            quantity: ideaSharesQuantity,
            investible_id: investibleId
        };
        const path = 'markets/' + marketId + '/investments';
        const createPromise = client.doPost(path, undefined, body);
        return createPromise.then(dataResolver);
    };
    /**
      * Deletes an investment in the given investible and market
      * @param marketId the id of the market to make the investment inspect
      * @param investibleId the id of the investible to invest inspect
      * @returns {PromiseLike<T> | Promise<T>} the result of the delete
      */
    this.deleteInvestment = function(marketId, investmentId){
        const path = 'markets/' + marketId + '/investments/' + investmentId;
        const deletePromise = client.doDelete(path, undefined, undefined);
        return deletePromise.then(dataResolver);
    };

    /**
     * Creates a market with the given options. Options is an object with the following form
     * <ul>
     *  <li>name : string, <b>required</b></li>
     *  <li>description: string, <b>required</b></li>
     *  <li>follow_default: boolean</li>
     *  <li>trending_window: number</li>
     *  <li>manual_roi: boolean</li>
     *  <li>quantity: number</li>
     * </ul>
     * @param marketOptions the options for the market
     * @returns {PromiseLike<T> | Promise<T>} the result of the create
     */
    this.createMarket = function(marketOptions){
        const path = 'markets';
        const body = marketOptions;
        const createPromise = client.doPost(path, undefined, body);
        return createPromise.then(dataResolver);
    };

    /**
     * Retrieves the market with the given Id.
     * @param marketId the id of the market to return
     * @returns {PromiseLike<T> | Promise<T>} the result of the retrieval
     */
    this.getMarket = function(marketId){
        const path = 'markets/' + marketId;
        const getPromise = client.doGet(path);
        return getPromise.then(dataResolver);
    };

    /**
     * Updates a market with the given options. Options is an object with the following form
     * <ul>
     *  <li>name : string, <b>required</b></li>
     *  <li>description: string, <b>required</b></li>
     *  <li>trending_window: number, <b>required</b></li>
     * </ul>
     * @param marketOptions the options for the market
     * @returns {PromiseLike<T> | Promise<T>} the result of the update
     */
    this.updateMarket = function(marketId, marketUpdateOptions){
        const path = 'markets/' + marketId;
        const body = marketUpdateOptions;
        const updatePromise = client.doPatch(path, undefined, body);
        return updatePromise.then(dataResolver);
    };

    /**
     * Resolves the given category in the market.
     * @param marketId the id of the market the category resides in
     * @param category the category to resolve
     * @returns {PromiseLike<T> | Promise<T>} the result of the resolve
     */
    this.resolveCategory = function(marketId, category){
        //TODO needs quantity
        const path = 'markets/' + marketId + '/resolve';
        const body = {category: category};
        const resolvePromise = client.doPatch(path, undefined, body);
        return resolvePromise.then(dataResolver);
    };

    /**
     * Resolves the given investible within the given market
     * @param marketId the id of the market to resolve the investible in
     * @param investibleId the id of the investible to resolve
     * @returns {PromiseLike<T> | Promise<T>} the result of the resolve
     */
    this.resolveInvestible = function(marketId, investibleId){
        const path = 'markets/' + marketId + '/investibles/' + investibleId + '/resolve';
        const resolvePromise = client.doPatch(path);
        return resolvePromise.then(dataResolver);
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
        const path = 'markets/' + marketId + '/follow';
        const followPromise = client.doPatch(path, undefined, body);
        return followPromise.then(dataResolver);
    };

    /**
     * Follows or unfollows the given investible in the given market
     * @param marketId the market id to follow/unfollow the investible in
     * @param investibleId the id of the investible to follow/unfollow
     * @param stopFollowing whether or not to STOP following the investible.
     * @returns {PromiseLike<T> | Promise<T>} the result of the follow/unfollow
     */
    this.followInvestible = function(marketId, investibleId, stopFollowing){
        let body = {};
        if(stopFollowing){
            body.remove = true;
        }

        const path = 'markets/' + marketId + '/investibles/' + investibleId + '/follow';
        const followPromise = client.doPatch(path, undefined, body);
        return followPromise.then(dataResolver);
    };

    /**
     * Updates the given investible in the given market according to the options
     * @param marketId
     * @param investibleId
     * @param investibleUpdateOptions a javascript object of the form
     * <ul>
     *  <li>name: string, <b>required</b></li>
     *  <li>description: string, <b>required</b></li>
     *  <li>categoryList: Array[string], <b>required</b></li>
     *  </ul>
     * @returns {PromiseLike<T> | Promise<T>} the result of the update
     */
    this.updateMarketInvestible = function(marketId, investibleId, investibleUpdateOptions){
        const body = investibleUpdateOptions;
        const path = 'markets/' + marketId + '/investibles/' + investibleId;
        const updatePromise = client.doPatch(path, undefined, body);
        return updatePromise.then(dataResolver);
    };

    /**
     * Fetches the given market investible from the given market
     * @param marketId the id of the market to retrieve the investible in
     * @param investibleId the id of the investible to retrieve
     * @returns {PromiseLike<T> | Promise<T>} the result of the fetch
     */
    this.getMarketInvestible = function(marketId, investibleId){
        const path = 'markets/' + marketId + '/investibles/' + investibleId;
        const getPromise = client.doGet(path);
        return getPromise.then(dataResolver);
    };

    this.listCategories = function (marketId) {
        const path = 'markets/' + marketId + '/list';
        const getPromise = client.doGet(path, {type: 'categories'});
        return getPromise.then(dataResolver)
    };

    this.listCategoriesInvestibles = function (marketId, category, pageNumber, pageSize) {
        const path = 'markets/' + marketId + '/list';
        const getPromise = client.doGet(path, {type: 'categoryInvestibles', category: category, currentPage: pageNumber, pageSize: pageSize});
        return getPromise.then(dataResolver)
    };

    this.listInvestibleInvestments = function (marketId, investibleId, pageNumber, pageSize, trendingWindowDate) {
        const path = 'markets/' + marketId + '/list';
        const getPromise = client.doGet(path, {type: 'investibleInvestments', investibleId: investibleId, currentPage: pageNumber, pageSize: pageSize, trendingWindowDate: trendingWindowDate});
        return getPromise.then(dataResolver)
    };

    this.listInvestiblePresences = function (marketId) {
        const path = 'markets/' + marketId + '/list';
        const getPromise = client.doGet(path, {type: 'investiblePresences'});
        return getPromise.then(dataResolver)
    };

    this.listInvestibles = function (marketId, searchString, currentPage, pageSize) {
        const path = 'markets/' + marketId + '/list';
        const getPromise = client.doGet(path, {type: 'investibles', searchString: searchString, currentPage: currentPage, pageSize: pageSize});
        return getPromise.then(dataResolver)
    };

    this.listInvestibleTemplates = function (marketId) {
        const path = 'markets/' + marketId + '/list';
        const getPromise = client.doGet(path, {type: 'investibleTemplates'});
        return getPromise.then(dataResolver)
    };

    this.listTrending = function (marketId, trendingWindowDate) {
        const path = 'markets/' + marketId + '/list';
        const getPromise = client.doGet(path, {type: 'trending', trendingWindowDate: trendingWindowDate});
        return getPromise.then(dataResolver)
    };

    this.listUserInvestments = function (marketId, userId, currentPage, pageSize) {
        const path = 'markets/' + marketId + '/list';
        const getPromise = client.doGet(path, {type: 'userInvestments', userId: userId, currentPage: currentPage, pageSize: pageSize});
        return getPromise.then(dataResolver)
    };
}

module.exports = (client) => {
    let myMarkets = new Markets(client);
    return myMarkets;
};
