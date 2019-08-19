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
     *    MarketManager} Duplicate values are ignored
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
      * Creates an investment in the given investible and market with the specified number of idea ideaShares
      * @param investibleId the id of the investible to invest
      * @param ideaSharesQuantity the number of idea shares for this user to be invested total in the investible
      * @param currentIdeaSharesQuantity the number of idea shares this user currently has invested in this investible
      * @returns {PromiseLike<T> | Promise<T>} the result of the investment
      */
    this.updateInvestment = function(investibleId, ideaSharesQuantity, currentIdeaSharesQuantity){
        const body = {
            quantity: ideaSharesQuantity,
            former_quantity: currentIdeaSharesQuantity,
            investible_id: investibleId
        };
        const createPromise = client.doPost(SUBDOMAIN, 'invest', undefined, body);
        return createPromise.then(dataResolver);
    };

    /**
     * Creates a market with the given options. Options is an object with the following form
     * <ul>
     *  <li>name : string, <b>required</b></li>
     *  <li>description: string, <b>required</b></li>
     *  <li>expiration_minutes: number</li>
     *  <li>manual_roi: boolean</li>
     *  <li>new_user_grant: number of shares to grant to a new user entering the account</li>
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
     *  <li>expiration_minutes: number</li>
     *  <li>active: boolean</li>
     *  <li>lock: boolean</li>
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
     * Updates the visited_at of the market indicating context viewed
     * @returns {PromiseLike<T> | Promise<T>} {visited_at: visited_at}
     */
    this.viewed = function(){
        const viewedPromise = client.doPatch(SUBDOMAIN, 'viewed');
        return viewedPromise.then(dataResolver);
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
     * @returns {PromiseLike<T> | Promise<T>} list of investible IDs and last_updated field
     */
    this.listInvestibles = function () {
        const path = 'list';
        let queryParams = {type: 'investibles'};
        const getPromise = client.doGet(SUBDOMAIN, path, queryParams);
        return getPromise.then(dataResolver);
    };

    /**
     * Lists users in a market
     * @returns {PromiseLike<T> | Promise<T>} list of users including name and email
     */
    this.listUsers = function () {
        const path = 'list';
        let queryParams = {type: 'users'};
        const getPromise = client.doGet(SUBDOMAIN, path, queryParams);
        return getPromise.then(dataResolver);
    };
}

export default Markets;
