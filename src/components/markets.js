import { dataResolver } from './utils';

/**
 * Module representing the market api
 * @param client the configured fetch client
 * @constructor
 */
export function Markets(client){

    const SUBDOMAIN = 'markets';


    /**
      * Creates an investment in the given investible and market with the specified number of idea ideaShares
      * @param investibleId the id of the investible to invest
      * @param ideaSharesQuantity the number of idea shares for this user to be invested total in the investible
      * @param currentIdeaSharesQuantity the number of idea shares this user currently has invested in this investible
      * @param reasonCommentId the comment ID of the reason given - if any
      * @param maxBudget answer to how long a planning market investible can be worked on and still have ROI
      * @returns {PromiseLike<T> | Promise<T>} the result of the investment
      */
    this.updateInvestment = function(investibleId, ideaSharesQuantity, currentIdeaSharesQuantity, reasonCommentId,
                                     maxBudget) {
        const body = {
            quantity: ideaSharesQuantity,
            former_quantity: currentIdeaSharesQuantity,
            investible_id: investibleId
        };
        if (reasonCommentId) {
            body.comment_id = reasonCommentId;
        }
        if (maxBudget) {
            body.max_budget = maxBudget;
        }
        const updatePromise = client.doPost(SUBDOMAIN, 'invest', undefined, body);
        return updatePromise.then(dataResolver);
    };

    /**
     * Removes an investment
     * @param investibleId of the investible to remove for the calling user
     * @returns {PromiseLike<T> | Promise<T>}
     */
    this.removeInvestment = function(investibleId) {
        const deletePromise = client.doDelete(SUBDOMAIN, 'invest/' + investibleId);
        return deletePromise.then(dataResolver);
    };

    /**
     * Creates a market with the given options. Options is an object with the following form
     * <ul>
     *  <li>name : string, <b>required</b></li>
     *  <li>description: string, <b>required</b></li>
     *  <li>expiration_minutes: number</li>
     *  <li>manual_roi: boolean</li>
     *  <li>new_user_grant: number of shares to grant to a new user entering the account</li>
     *  <li>uploaded_files: list of uploaded files
     *  <li>market_type: one of PLANNING, DECISION, or INITIATIVE
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
     *  <li>uploaded_files: list of uploaded files
     * </ul>
     * @param marketUpdateOptions the options for the market
     * @returns {PromiseLike<T> | Promise<T>} the result of the update
     */
    this.updateMarket = function(marketUpdateOptions){
        const updatePromise = client.doPatch(SUBDOMAIN, 'update', undefined, marketUpdateOptions);
        return updatePromise.then(dataResolver);
    };

    /**
     * Locks a market for name and description changes
     * @param breakLock whether or not to ignore the existing lock
     * @returns {PromiseLike<T> | Promise<T>} the base market
     */
    this.lock = function (breakLock) {
        const body = {};
        if (breakLock) {
            body.break_lock = breakLock;
        }
        const lockPromise = client.doPatch(SUBDOMAIN, 'lock', undefined, body);
        return lockPromise.then(dataResolver);
    };

    /**
     * Hides a market for the current user
     * @returns {PromiseLike<T> | Promise<T>} the result of the hide
     */
    this.hide = function () {
        const body = {
            hide: true,
        };
        const hidePromise = client.doPatch(SUBDOMAIN, 'hide', undefined, body);
        return hidePromise.then(dataResolver);
    };

    /**
     * Unhides a makret for the current user
     * @returns {PromiseLike<T> | Promise<T>} the result of the unhide
     */
    this.unhide = function () {
        const body = {
            hide: false,
        };
        const unhidePromise = client.doPatch(SUBDOMAIN, 'hide', undefined, body);
        return unhidePromise.then(dataResolver);
    };

    /**
     * Unlocks a market for name and description changes
     * @returns {PromiseLike<T> | Promise<T>} the result of unlocking
     */
    this.unlock = function () {
        const unlockPromise = client.doPatch(SUBDOMAIN, 'unlock');
        return unlockPromise.then(dataResolver);
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
     * Follows or unfollows the given market.
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
        const body = {};
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
     * Lists users in a market
     * @returns {PromiseLike<T> | Promise<T>} list of users including name and email
     */
    this.listUsers = function () {
        const path = 'list';
        let queryParams = {type: 'users'};
        const getPromise = client.doGet(SUBDOMAIN, path, queryParams);
        return getPromise.then(dataResolver);
    };

    /**
     * Attaches files to the market
     * @param attachments
     */
    this.addAttachments = function(files) {
        const path = 'add_attachments';
        const body = {
            files,
        };
        const patchPromise = client.doPatch(SUBDOMAIN, path, undefined, body);
        return patchPromise.then(dataResolver);
    }
}

export default Markets;
