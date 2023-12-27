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
      * @param maxBudget value of the planning investible
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
     * Abstains or not from a market
     * @param isAbstain whether or not the user plans to vote in this market
     * @returns {PromiseLike<T> | Promise<T>} the altered user capability
     */
    this.updateAbstain = function(isAbstain) {
        const body = {
            is_abstain: isAbstain,
        };
        const updatePromise = client.doPost(SUBDOMAIN, 'abstain', undefined, body);
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
     *  <li>market_type: one of PLANNING, DECISION, or INITIATIVE
     * </ul>
     * @param marketOptions the options for the market
     * @returns {PromiseLike<T> | Promise<T>} the result of the create
     */
    this.createMarket = function(marketOptions){
        const createPromise = client.doPost(SUBDOMAIN, 'create', undefined, marketOptions);
        return createPromise.then(dataResolver);
    };

    this.getDemo = function(){
        const createPromise = client.doPost(SUBDOMAIN, 'demo');
        return createPromise.then(dataResolver);
    };

    this.createGroup = function(groupOptions){
        const createPromise = client.doPost(SUBDOMAIN, 'create_group', undefined, groupOptions);
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

    this.updateGroup = function(groupId, groupUpdateOptions){
        const updatePromise = client.doPatch(SUBDOMAIN, `update_group/${groupId}`, undefined,
            groupUpdateOptions);
        return updatePromise.then(dataResolver);
    };

    /**
     * Locks a group for name and description changes
     * @param groupId
     * @param breakLock whether or not to ignore the existing lock
     * @returns {PromiseLike<T> | Promise<T>} the base market
     */
    this.lock = function(groupId, breakLock) {
        const body = {};
        if (breakLock) {
            body.break_lock = breakLock;
        }
        const lockPromise = client.doPatch(SUBDOMAIN, `lock/${groupId}`, undefined, body);
        return lockPromise.then(dataResolver);
    };

    /**
     * Unlocks a group for name and description changes
     * @returns {PromiseLike<T> | Promise<T>} the result of unlocking
     */
    this.unlock = function(groupId) {
        const unlockPromise = client.doPatch(SUBDOMAIN, `unlock/${groupId}`);
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
     * Controls membership of a group.
     * @param groupId
     * @param addressed collection in the form of user_id, is_following
     * @returns {PromiseLike<T> | Promise<T>} the result of the follow/unfollow
     */
    this.followGroup = function(groupId, addressed){
        const path = 'follow/' + groupId;
        let body = {
            addressed
        };
        const followPromise = client.doPatch(SUBDOMAIN, path, undefined, body);
        return followPromise.then(dataResolver);
    };

    /**
     * Updates stage properties
     * @param stageId the stage id to update
     * @param allowedInvestibles number of investibles a stage can hold per person.
     * @param daysVisible number of days an investible will appear in Verified stage
     * @returns {PromiseLike<T> | Promise<T>} the updated stage
     */
    this.updateStage = function(stageId, allowedInvestibles, daysVisible){
        const body = {};
        if (allowedInvestibles !== undefined) {
            body.allowed_investibles = allowedInvestibles;
        }
        if (daysVisible !== undefined) {
            body.days_visible = daysVisible;
        }
        const path = 'stage/' + stageId;
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
        const queryParams = {type: 'users'};
        const getPromise = client.doGet(SUBDOMAIN, 'list', queryParams);
        return getPromise.then(dataResolver);
    };

    /**
     * Lists groups in a market
     * @returns {PromiseLike<T> | Promise<T>} list of groups including member userIds
     */
    this.listGroups = function () {
        const queryParams = {type: 'groups'};
        const getPromise = client.doGet(SUBDOMAIN, 'list', queryParams);
        return getPromise.then(dataResolver);
    };

    /**
     * Lists group members
     * @returns {PromiseLike<T> | Promise<T>} list of members including userId, version and deleted
     */
    this.listGroupMembers = function(groupIds) {
        const queryParams = {type: 'group_members', id: groupIds};
        const getPromise = client.doGet(SUBDOMAIN, 'list', queryParams);
        return getPromise.then(dataResolver);
    };


    this.deleteAttachments = function(groupId, files) {
        const path = `delete_attachments/${groupId}`;
        const body = {
            files,
        };
        const patchPromise = client.doPatch(SUBDOMAIN, path, undefined, body);
        return patchPromise.then(dataResolver);
    }

    /**
     * Attaches files to the market
     * @param groupId
     * @param files
     */
    this.addAttachments = function(groupId, files) {
        const path = `add_attachments/${groupId}`;
        const body = {
            files,
        };
        const patchPromise = client.doPatch(SUBDOMAIN, path, undefined, body);
        return patchPromise.then(dataResolver);
    }
}

export default Markets;
