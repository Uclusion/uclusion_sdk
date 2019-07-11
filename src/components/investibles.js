import { dataResolver } from './utils';
/**
 * Module for the investibles api
 * @param client the configured fetch clent

 */
export function Investibles(client) {

  const SUBDOMAIN = 'investibles';

  /**
   * Creates an investible
   * @param investibleName name of investible
   * @param investibleDescription description of investible
   * @returns {PromiseLike<T> | Promise<T>} result of creating an investible
   */
  this.create = function (investibleName, investibleDescription) {
    const body = {
      name: investibleName,
      description: investibleDescription
    };
    const createPromise = client.doPost(SUBDOMAIN, 'create', undefined, body);
    return createPromise.then(dataResolver);
  };

  /**
   * Updates an investible with name, description, and categories
   * @param investibleId the id of the investible updated
   * @param investibleName name of investible
   * @param investibleDescription description of investible
   * @param labelList list of labels
   * @returns {PromiseLike<T> | Promise<T>} result of updating investible
   */
  this.update = function (investibleId, investibleName, investibleDescription, labelList) {
    const body = {
      name: investibleName,
      description: investibleDescription,
      label_list: labelList
    };
    const updatePromise = client.doPatch(SUBDOMAIN, investibleId, undefined, body);
    return updatePromise.then(dataResolver);
  };

  /**
   * Gets the investible with given id
   * @param investibleId the id of the investible
   * @returns {PromiseLike<T> | Promise<T>} result of getting investible
   */
  this.get = function (investibleId) {
    const getPromise = client.doGet(SUBDOMAIN, investibleId);
    return getPromise.then(dataResolver);
  };

  /**
   * Deletes investible with given id
   * @param investibleId id of the investible
   * @returns {*|PromiseLike<T>|Promise<T>} result of deleting investible
   */
  this.delete = function (investibleId) {
    const getPromise = client.doDelete(SUBDOMAIN, investibleId);
    return getPromise.then(dataResolver);
  };


  /**
   * Follows or unfollows the given investible in the given market
   * @param investibleId the id of the investible to follow/unfollow
   * @param stopFollowing whether or not to STOP following the investible.
   * @returns {PromiseLike<T> | Promise<T>} the result of the follow/unfollow
   */
  this.follow = function (investibleId, stopFollowing) {
    let body = {};
    if (stopFollowing) {
      body.remove = true;
    }
    const path = 'follow/' + investibleId;
    const followPromise = client.doPatch(SUBDOMAIN, path, undefined, body);
    return followPromise.then(dataResolver);
  };

  /**
   * Creates a comment for an investible
   * @param investibleId the id of the investible to create the comment for
   * @param body html body of the comment
   * @param replyId comment_id of the parent comment
   * @returns {PromiseLike<T> | Promise<T>} resolution_id result
   */
  this.createComment = function (investibleId, body, replyId) {
    const path = investibleId + '/comment';
    const msgBody = {
      body: body
    };
    if (replyId) {
      msgBody.replyId = replyId;
    }
    const commentPromise = client.doPost(SUBDOMAIN, path, undefined, msgBody);
    return commentPromise.then(dataResolver);
  };

  /**
   * Updates a comment
   * @param commentId the id of the comment to update
   * @param body html body of the comment
   * @returns {PromiseLike<T> | Promise<T>} resolution_id result
   */
  this.updateComment = function (commentId, body) {
    const path = 'comment/' + commentId;
    const msgBody = {
      body: body
    };
    const commentPromise = client.doPatch(SUBDOMAIN, path, undefined, msgBody);
    return commentPromise.then(dataResolver);
  };

  /**
   * Deletes a comment
   * @param commentId the id of the comment to delete
   * @returns {PromiseLike<T> | Promise<T>} resolution_id result
   */
  this.deleteComment = function (commentId) {
    const path = 'comment/' + commentId;
    const commentPromise = client.doDelete(SUBDOMAIN, path);
    return commentPromise.then(dataResolver);
  };


  /**
   * Allows or stops different operations on an investible by setting stage. stateOptions is an object with form
   * shown below
   * <ul>
   *  <li>stage_id: string, <b>required</b></li>
   *  <li>current_stage_id: string, <b>required</b></li>
   *  <li>next_stage_additional_investment: number</li>
   * </ul>
   * @param investibleId the id of the investible to control
   * @param stateOptions controls the stage of the market investible and can overwrite next_stage_additional_investment
   * @returns {PromiseLike<T> | Promise<T>} the result of the allowed interaction call
   */
  this.stateChange = function (investibleId, stateOptions) {
    const path = 'state/' + investibleId;
    const updatePromise = client.doPatch(SUBDOMAIN, path, undefined, stateOptions);
    return updatePromise.then(dataResolver);
  };

  /**
   * Lists comments associated with the current market and returns their IDs and updated times
   * @returns {PromiseLike<T | never> | Promise<T | never>}
   */
  this.listCommentsByMarket = function () {
    const path = 'list/comments';
    const getPromise = client.doGet(SUBDOMAIN, path);
    return getPromise.then(dataResolver);
  };

  /**
   * Fetches the given comments present in the given market. The maximum number of comments
   * that can be requested at one time is 100.
   * @param commentIds list of the comment ids to retrieve. Max length of 100
   * @returns {PromiseLike<T> | Promise<T>} the result of the fetch
   */
  this.getMarketComments = function(commentIds){
    let path = 'comments';
    let queryParams = {id: commentIds};
    const getPromise = client.doGet(SUBDOMAIN, path, queryParams);
    return getPromise.then(dataResolver);
  };


}

export default Investibles;