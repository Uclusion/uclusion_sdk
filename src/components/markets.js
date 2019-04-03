/**
 * Module representing the market api
 * @param client the configured fetch client
 * @constructor
 */
export function Markets(client){

    const SUBDOMAIN = 'markets';

  /**
   * Unpacks a result body and returns just the data portion
   * @param result the result body
   * @returns {*} the data portion of the body
   */
    const dataResolver = (result) => { return result.data };

    /**
     * Creates a new stage in the market provided.
     * @param marketId the id of the market to create the stage in
     * @param stage_info a dict of stage creation information of the form
     *  { name: string, required <=>255 chars
     *    automatic_transition: optional dict of form {
     *        additional_investment: number , min 1
     *        next_stage: string, id of some other stage
     *    }
     *    appears_in_market_summary: boolean, required
     *    allows_investment: boolean, required. If automatic_transition present, then must be true
     *    allows_refunds: boolean, required,
     *    allows_editing: boolean, required
     *    visible_to_roles. array of length >=1 drawn from the set of {MarketAnonymousUser, MarketUser,
     *    MarketTeamAdmin, MarketManager} Duplicate values are ignored
     *  }
     * @returns {PromiseLike<T | never> | Promise<T | never>} the created stage's info
     */
    this.createStage = function(marketId, stageInfo){
        const body = stageInfo;
        const path = marketId + '/stage';
        const createPromise = client.doPost(SUBDOMAIN, path, undefined, body);
        return createPromise.then(dataResolver);
    };


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
     * Creates an investment in the given investible and market with the specified number
     * of idea ideaShares and categories
     * @param marketId the id of the market to make the investment inspect
     * @param teamId the id of the team making the investment
     * @param investibleId the id of the investible to invest
     * @param ideaSharesQuantity the number of idea shares to investible
     * @param categoryList list of categories
     * @returns {PromiseLike<T> | Promise<T>} the result of the investment
     */
    this.investAndBind = function(marketId, teamId, investibleId, ideaSharesQuantity, categoryList){
        const body = {
            quantity: ideaSharesQuantity,
            investible_id: investibleId,
            category_list: categoryList
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
     * Deletes all user investments in the given investible and market
     * @param marketId the id of the market to make the investment inspect
     * @param investibleId the id of the investible to invest inspect
     * @returns {PromiseLike<T> | Promise<T>} the result of the delete
     */
    this.deleteInvestments = function(marketId, investibleId){
        const path = marketId + '/investible/' + investibleId;
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
     *  <li>new_team_grant: number of shares to grant to a new team when they enter the account</li>
     *  <li>new_user_grant: number of shares to grant to a new team when they enter the account</li>
     *  <li>investment_bonus_threshold: number of shares the user has to invest to cross into an "active" user</li>
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
     *  <li>initial_stage_id: string, <b>required</b>: Id of the initial stage for the market</li>
     * </ul>
     * @param marketId Market to update
     * @param marketUpdateOptions the options for the market
     * @returns {PromiseLike<T> | Promise<T>} the result of the update
     */
    this.updateMarket = function(marketId, marketUpdateOptions){
        const updatePromise = client.doPatch(SUBDOMAIN, marketId, undefined, marketUpdateOptions);
        return updatePromise.then(dataResolver);
    };

    /**
     * Deletes the given market from the system
     * @param marketId the id of the market to delete
     * @returns {PromiseLike<T | never> | Promise<T | never>} when resolved gives the result of the deletion
     *
     */
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
     * Follows or unfollows the given stage
     * @param marketId the market id the stage is in
     * @param stageId the market id to follow/unfollow
     * @param stopFollowing whether or not to STOP following the market.
     * @returns {PromiseLike<T> | Promise<T>} the result of the follow/unfollow
     */
    this.followStage = function(stageId, marketId, stopFollowing){
        let body = {};
        if(stopFollowing){
            body.remove = true;
        }
        const path = 'follow/' + marketId + '/stage/' + stageId;
        const followPromise = client.doPatch(SUBDOMAIN, path, undefined, body);
        return followPromise.then(dataResolver);
    };

    /**
    * Lists all of the stages present in the market that the user has access too
    * @param marketId the id of the market to list stages for
    * @returns {PromiseLike<T | never> | Promise<T | never>} the list of stages
    */
    this.listStages = function(marketId) {
      let path = marketId + '/stages';
      const getPromise = client.doGet(SUBDOMAIN, path);
      return getPromise.then(dataResolver);
    };

    /**
     * Lists ROI
     * @param resolutionId ID of an investible or investibles to list ROI
     * @param marketId Market to list ROI for
     * @param resolutionId optional constraint
     * @returns {PromiseLike<T> | Promise<T>}
     */
    this.listRoi = function(marketId, resolutionId) {
        let path = 'roi/' + resolutionId;
        let queryParams = {marketId: marketId};
        const getPromise = client.doGet(SUBDOMAIN, path, queryParams);
        return getPromise.then(dataResolver);
    };

    /**
     * Fetches requested market investibles from the given market
     * @param marketId the id of the market to retrieve the investible in
     * @param investibleIds list of the investible id to retrieve
     * @returns {PromiseLike<T> | Promise<T>} the result of the fetch
     */
    this.getMarketInvestibles = function(marketId, investibleIds){
        let path = marketId + '/investibles';
        let queryParams = {id: investibleIds};
        const getPromise = client.doGet(SUBDOMAIN, path, queryParams);
        return getPromise.then(dataResolver);
    };

    /**
     * This method allows the client to discover which investibles in its store have changed.
     * Here last_updated includes changes to the investible or investments in it.
     * @param marketId Market to search
     * @returns {PromiseLike<T> | Promise<T>} list of categories, investible IDs and last_updated field
     */
    this.listInvestibles = function (marketId) {
        const path = 'list/' + marketId;
        let queryParams = {type: 'investibles'};
        const getPromise = client.doGet(SUBDOMAIN, path, queryParams);
        return getPromise.then(dataResolver);
    };

    /**
     * Lists the user's investments
     * @param marketId the id of the market the investments are in
     * @param userId the id of the user to list investments for
     * @param pageSize the maximum number of results you can consume
     * @param lastEvaluatedKey the cookie telling us what the last page you've looked at is
     * @returns {PromiseLike<T | never> | Promise<T | never>} when resolved contains the list of user investments
     * for the user and page we're on
     */
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
