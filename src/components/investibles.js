export function Investibles(client) {

  const SUBDOMAIN = 'investibles';

  const dataResolver = (result) => {
    return result.data;
  };

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
   * Creates a category
   * @param name name of investible
   * @param marketId market_id of the category
   * @returns {PromiseLike<T> | Promise<T>} resulting category
   */
  this.createCategory = function (name, marketId) {
    const path = 'category/' + marketId;
    const body = {
      name: name
    };
    const createPromise = client.doPost(SUBDOMAIN, path, undefined, body);
    return createPromise.then(dataResolver);
  };

  /**
   * Deletes a category
   * @param name name of category
   * @param marketId market_id of the category
   * @returns {PromiseLike<T> | Promise<T>} result of delete
   */
  this.deleteCategory = function (name, marketId) {
    const path = 'market/' + marketId + '/category/' + name;
    const createPromise = client.doDelete(SUBDOMAIN, path, undefined);
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
  this.update = function (investibleId, investibleName, investibleDescription, categoryList) {
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
  this.updateInMarket = function (investibleId, marketId, investibleName, investibleDescription, categoryList) {
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
   * Creates a resolution_id object which initiates asynchronous creation of ROI suggestions
   * @param investibleId the id of the investible to create ROI from
   * @returns {PromiseLike<T> | Promise<T>} resolution_id result
   */
  this.initiateRoi = function (investibleId) {
    const path = 'roi/' + investibleId;
    const roiPromise = client.doPatch(SUBDOMAIN, path, undefined, undefined);
    return roiPromise.then(dataResolver);
  };

  /**
   * Puts a copy of an investible into a market - for use by L3/L2 that cannot invest
   * @param investibleId the id of the investible to bind
   * @param marketId the id of the market the investible will display in
   * @returns {PromiseLike<T> | Promise<T>} copied investible result
   */
  this.bindToMarket = function (investibleId, marketId, categoryList) {
    const path = investibleId + '/bind/' + marketId;
    const body = {
      category_list: categoryList
    };
    const bindPromise = client.doPost(SUBDOMAIN, path, undefined, body);
    return bindPromise.then(dataResolver);
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
   * Fetches a given comment and returns it in whole
   * @param commentId the id of the comment it to get
   * @returns {PromiseLike<T | never> | Promise<T | never>}
   */
  this.getComment = function (commentId) {
    const path = 'comment/' + commentId;
    const commentPromise = client.doGet(SUBDOMAIN, path);
    return commentPromise.then(dataResolver);
  };

  /**
   * Allows or stops different operations on an investible and sets stage. stateOptions is an object with form
   * shown below where all parameters are optional
   * <ul>
   *  <li>open_for_investment : boolean</li>
   *  <li>open_for_refunds: boolean</li>
   *  <li>open_for_editing: boolean</li>
   *  <li>is_active: boolean</li>
   *  <li>stage: string</li>
   *  <li>current_stage: string</li>
   *  <li>next_stage: string</li>
   *  <li>next_stage_threshold: number</li>
   * </ul>
   * @param investibleId the id of the investible to control
   * @param stateOptions controls the state of the market investible. current_stage required if stage specified.
   * @returns {PromiseLike<T> | Promise<T>} the result of the allowed interaction call
   */
  this.stateChange = function (investibleId, stateOptions) {
    const path = 'state/' + investibleId;
    const updatePromise = client.doPatch(SUBDOMAIN, path, undefined, stateOptions);
    return updatePromise.then(dataResolver);
  };

  /**
   * Listed investibles that a user has which are not bound to a market (ie draft or template)
   * @param pageSize Maximum number of templates to return
   * @param lastEvaluated Optional investible_id last evaluated for pagination
   * @returns {PromiseLike<T> | Promise<T>}
   */
  this.listTemplates = function (pageSize, lastEvaluated) {
    let queryParams = {
      pageSize: pageSize
    };
    if (lastEvaluated) {
      queryParams.lastEvaluated = lastEvaluated;
    }
    const getPromise = client.doGet(SUBDOMAIN, 'list', queryParams);
    return getPromise.then(dataResolver);
  };

  /**
   * Listed comments associated with an investible
   * @param investibleId the id of the investible to list comments of
   * @param pageSize Maximum number of templates to return
   * @param lastEvaluated Optional investible_id last evaluated for pagination
   * @returns {PromiseLike<T> | Promise<T>}
   */
  this.listComments = function (investibleId, pageSize, lastEvaluated) {
    const path = 'comments/' + investibleId;
    let queryParams = {
      pageSize: pageSize
    };
    if (lastEvaluated) {
      queryParams.lastEvaluated = lastEvaluated;
    }
    const getPromise = client.doGet(SUBDOMAIN, path, queryParams);
    return getPromise.then(dataResolver);
  };

}

export default Investibles;