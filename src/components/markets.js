import { dataResolver } from './utils';

/**
 * Module representing the market api
 * @param client the configured fetch client
 * @constructor
 */
export function Markets(client){

    const SUBDOMAIN = 'markets';

    /**
     * Creates a new stage in the market provided.
     * @param stage_info a dict of stage creation information of the form
     *  { name: string, required <=>255 chars
     *    automatic_transition: optional dict of form {
     *        additional_investment: number , min 1
     *        next_stage: string, id of some other stage
     *    }
     *    appears_in_market_summary: boolean, required
     *    allows_investment: boolean, required. If automatic_transition present, then must be true
     *    allows_refunds: boolean, required
     *    visible_to_roles. array of length >=1 drawn from the set of {MarketAnonymousUser, MarketUser,
     *    MarketTeamAdmin, MarketManager} Duplicate values are ignored
     *  }
     * @returns {PromiseLike<T | never> | Promise<T | never>} the created stage's info
     */
    this.createStage = function(stageInfo){
        const body = stageInfo;
        const path = 'stage';
        const createPromise = client.doPost(SUBDOMAIN, path, undefined, body);
        return createPromise.then(dataResolver);
    };


    /**
      * Creates an investment in the given investible and market with the specified number
      * of idea ideaShares
\      * @param teamId the id of the team making the investment
      * @param investibleId the id of the investible to invest
      * @param ideaSharesQuantity the number of idea shares to investible
      * @returns {PromiseLike<T> | Promise<T>} the result of the investment
      */
    this.createInvestment = function(teamId, investibleId, ideaSharesQuantity){
        const body = {
            quantity: ideaSharesQuantity,
            investible_id: investibleId
        };
        const path = 'teams/' + teamId + '/invest';
        const createPromise = client.doPost(SUBDOMAIN, path, undefined, body);
        return createPromise.then(dataResolver);
    };

    /**
     * Creates an investment in the given investible and market with the specified number
     * of idea ideaShares and categories
     * @param teamId the id of the team making the investment
     * @param investibleId the id of the investible to invest
     * @param ideaSharesQuantity the number of idea shares to investible
     * @param categoryList list of categories
     * @returns {PromiseLike<T> | Promise<T>} the result of the investment
     */
    this.investAndBind = function(teamId, investibleId, ideaSharesQuantity, categoryList){
        const body = {
            quantity: ideaSharesQuantity,
            investible_id: investibleId,
            category_list: categoryList
        };
        const path = 'teams/' + teamId + '/invest';
        const createPromise = client.doPost(SUBDOMAIN, path, undefined, body);
        return createPromise.then(dataResolver);
    };

    /**
      * Deletes an investment in the given investible and market
      * @param investmentId the id of the investible to invest inspect
      * @returns {PromiseLike<T> | Promise<T>} the result of the delete
      */
    this.deleteInvestment = function(investmentId){
        const path = 'investments/' + investmentId;
        const deletePromise = client.doDelete(SUBDOMAIN, path, undefined, undefined);
        return deletePromise.then(dataResolver);
    };

    /**
     * Deletes all user investments in the given investible and market
     * @param investibleId the id of the investible to invest inspect
     * @returns {PromiseLike<T> | Promise<T>} the result of the delete
     */
    this.deleteInvestments = function(investibleId){
        const path = 'investible/' + investibleId;
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
     *  <li>default_categories: bool controlling whether to create default categories or not</li>
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
     * @returns {PromiseLike<T> | Promise<T>} the result of the retrieval
     */
    this.get = function(){
        const getPromise = client.doGet(SUBDOMAIN, 'get');
        return getPromise.then(dataResolver);
    };

    /**
     * Updates a market with the given options. Options is an object with the following form
     * <ul>
     *  <li>name : string</li>
     *  <li>description: string</li>
     *  <li>trending_window: number</li>
     *  <li>active: boolean</li>
     *  <li>initial_stage_id: string: Id of the initial stage for the market</li>
     * </ul>
     * @param marketUpdateOptions the options for the market
     * @returns {PromiseLike<T> | Promise<T>} the result of the update
     */
    this.updateMarket = function(marketUpdateOptions){
        const updatePromise = client.doPatch(SUBDOMAIN, 'update', undefined, marketUpdateOptions);
        return updatePromise.then(dataResolver);
    };

    /**
     * Deletes the given market from the system
     * @returns {PromiseLike<T | never> | Promise<T | never>} when resolved gives the result of the deletion
     *
     */
    this.deleteMarket = function(){
        const getPromise = client.doDelete(SUBDOMAIN, 'delete');
        return getPromise.then(dataResolver);
    };

    /**
     * Follows or unfollows the given market
     * @param stopFollowing whether or not to STOP following the market.
     * @returns {PromiseLike<T> | Promise<T>} the result of the follow/unfollow
     */
    this.followMarket = function(stopFollowing){
        let body = {};
        if(stopFollowing){
            body.remove = true;
        }
        const path = 'follow';
        const followPromise = client.doPatch(SUBDOMAIN, path, undefined, body);
        return followPromise.then(dataResolver);
    };

    /**
     * Follows or unfollows the given stage
     * @param stageId the market id to follow/unfollow
     * @param stopFollowing whether or not to STOP following the market.
     * @returns {PromiseLike<T> | Promise<T>} the result of the follow/unfollow
     */
    this.followStage = function(stageId, stopFollowing){
        let body = {};
        if(stopFollowing){
            body.remove = true;
        }
        const path = 'follow/stage/' + stageId;
        const followPromise = client.doPatch(SUBDOMAIN, path, undefined, body);
        return followPromise.then(dataResolver);
    };

    /**
    * Lists all of the stages present in the market that the user has access too
    * @returns {PromiseLike<T | never> | Promise<T | never>} the list of stages
    */
    this.listStages = function() {
      let path = 'stages';
      const getPromise = client.doGet(SUBDOMAIN, path);
      return getPromise.then(dataResolver);
    };

    /**
     * Lists ROI
     * @param resolutionId ID of an investible or investibles to list ROI
     * @returns {PromiseLike<T> | Promise<T>}
     */
    this.listRoi = function(resolutionId) {
        let path = 'roi/' + resolutionId;
        const getPromise = client.doGet(SUBDOMAIN, path);
        return getPromise.then(dataResolver);
    };

    /**
     * Fetches requested market investibles from the given market
     * @param marketId the id of the market to retrieve the investible in
     * @param investibleIds list of the investible id to retrieve
     * @returns {PromiseLike<T> | Promise<T>} the result of the fetch
     */
    this.getMarketInvestibles = function(investibleIds){
        let path = 'investibles';
        let queryParams = {id: investibleIds};
        const getPromise = client.doGet(SUBDOMAIN, path, queryParams);
        return getPromise.then(dataResolver);
    };

    /**
     * This method allows the client to discover which investibles in its store have changed.
     * Here last_updated includes changes to the investible or investments in it.
     * @returns {PromiseLike<T> | Promise<T>} list of categories, investible IDs and last_updated field
     */
    this.listInvestibles = function () {
        const path = 'list';
        let queryParams = {type: 'investibles'};
        const getPromise = client.doGet(SUBDOMAIN, path, queryParams);
        return getPromise.then(dataResolver);
    };

    /**
     * Lists the user's investments
     * @param userId the id of the user to list investments for
     * @returns {PromiseLike<T | never> | Promise<T | never>} when resolved contains the list of user investments
     * for the user and page we're on
     */
    this.listUserInvestments = function (userId) {
        const path = 'list';
        let queryParams = {type: 'userInvestments', userId: userId };

        const getPromise = client.doGet(SUBDOMAIN, path, queryParams);
        return getPromise.then(dataResolver);
    };

    /**
     * Summarizes the user's investments. Specifically, investments in a single investible
     * are summed over the investible. Because of this, detailed individual investment information is not
     * available
     * @param userId the id of the user to summarize investments for
     * @returns {PromiseLike<T | never> | Promise<T | never>} when resolved contains the list of user investments
     * for the user and page we're on
     */
    this.summarizeUserInvestments = function (userId) {
        const path = 'list';
        let queryParams = {type: 'userInvestmentsSummary', userId: userId };
        const getPromise = client.doGet(SUBDOMAIN, path, queryParams);
        return getPromise.then(dataResolver);
    };
}

export default Markets;
