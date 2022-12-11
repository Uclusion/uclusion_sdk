import { dataResolver } from './utils';
/**
 * Module for the investibles api
 * @param client the configured fetch clent

 */
export function Investibles(client) {

  const SUBDOMAIN = 'investibles';

  /**
   * Creates an investible
   * @param addInfo of form
   * name name of investible
   * description description of investible
   * uploadedFiles the metadata about files uploaded to this investible
   * assignments set of user IDs
   * estimate completion estimate Date
   * labelList list of labels to apply on create
   * requiredReviewers
   * requiredApprovers
   * stageId - initial stage to create the investible in
   * @returns {PromiseLike<T> | Promise<T>} result of creating an investible
   */
  this.create = function (addInfo) {
    const { name, description, uploadedFiles, assignments, estimate, labelList, requiredReviewers, requiredApprovers,
      stageId, openForInvestment, groupId, addressed } = addInfo;
    const body = {
      name: name
    };
    if (description) {
      body.description = description;
    }
    if (Array.isArray(uploadedFiles)) {
      body.uploaded_files = uploadedFiles;
    }
    if (Array.isArray(addressed)) {
      body.addressed = addressed;
    }
    if (Array.isArray(assignments)) {
      body.assignments = assignments;
    }
    if (openForInvestment) {
      body.open_for_investment = openForInvestment;
    }
    if (estimate) {
      body.completion_estimate = estimate.toISOString();
    }
    if (labelList) {
      body.label_list = labelList;
    }
    if (Array.isArray(requiredReviewers)) {
      body.required_reviewers = requiredReviewers;
    }
    if (Array.isArray(requiredApprovers)) {
      body.required_approvers = requiredApprovers;
    }
    if (stageId) {
      body.stage_id = stageId;
    }
    if (groupId) {
      body.group_id = groupId;
    }
    const createPromise = client.doPost(SUBDOMAIN, 'create', undefined, body);
    return createPromise.then(dataResolver);
  };

  /**
   * Updates an investible with name, description, and categories - requires a lock
   * @param investibleId the id of the investible updated
   * @param investibleName name of investible
   * @param investibleDescription description of investible
   * @param labelList list of labels
   * @param uploadedFiles the files to upload
   * @param estimate completion estimate Date
   * @param requiredReviewers
   * @param requiredApprovers
   * @param openForInvestment ready or not
   * @returns {PromiseLike<T> | Promise<T>} result of updating investible
   */
  this.update = function (investibleId, investibleName, investibleDescription, labelList, uploadedFiles, estimate,
                          requiredReviewers, requiredApprovers, openForInvestment) {
    const body = {};
    if (investibleName) {
      body.name = investibleName;
    }
    if (investibleDescription) {
      body.description = investibleDescription;
    }
    if (Array.isArray(labelList)) {
      body.label_list = labelList;
    }
    if (Array.isArray(uploadedFiles)) {
      body.uploaded_files = uploadedFiles;
    }
    if (Array.isArray(requiredReviewers)) {
      body.required_reviewers = requiredReviewers;
    }
    if (Array.isArray(requiredApprovers)) {
      body.required_approvers = requiredApprovers
    }
    if (openForInvestment) {
      body.open_for_investment = openForInvestment;
    }
    if (estimate) {
      body.completion_estimate = estimate.toISOString();
    }
    const updatePromise = client.doPatch(SUBDOMAIN, investibleId, undefined, body);
    return updatePromise.then(dataResolver);
  };

  /**
   * @param investibleId - comments will move to this investible ID
   * @param commentIds
   * @param resolveCommentIds
   * @returns list of comments
   */
  this.moveComments = function (investibleId, commentIds, resolveCommentIds) {
    const path = 'move/' + investibleId;
    const body = {
      comment_ids: commentIds
    };
    if (resolveCommentIds) {
      body['resolve_comment_ids'] = resolveCommentIds;
    }
    const movePromise = client.doPatch(SUBDOMAIN, path, undefined, body);
    return movePromise.then(dataResolver);
  };

  /**
   * Updates an investible's assignments - does not require a lock
   * @param investibleId the id of the investible updated
   * @param assignments set of user IDs
   * @returns {PromiseLike<T> | Promise<T>} result of updating investible
   */
  this.updateAssignments = function (investibleId, assignments) {
    const body = {
      assignments: assignments,
    };
    const updatePromise = client.doPatch(SUBDOMAIN, investibleId, undefined, body);
    return updatePromise.then(dataResolver);
  };

  /**
   * Updates an investible's open for investments - does not require a lock
   * @param investibleId the id of the investible updated
   * @param openForInvestment boolean
   * @returns {PromiseLike<T> | Promise<T>} result of updating investible
   */
  this.updateOpenForInvestment = function (investibleId, openForInvestment) {
    const body = {
      open_for_investment: openForInvestment,
    };
    const updatePromise = client.doPatch(SUBDOMAIN, investibleId, undefined, body);
    return updatePromise.then(dataResolver);
  };

  /**
   * Locks an investible for name and description
   * @param investibleId the id of the investible locked
   * @param breakLock whether or not to ignore the existing lock
   * @returns {PromiseLike<T> | Promise<T>} the base investible
   */
  this.lock = function (investibleId, breakLock) {
    const body = {};
    if (breakLock) {
      body.break_lock = breakLock;
    }
    const lockPromise = client.doPatch(SUBDOMAIN, 'lock/'+investibleId, undefined, body);
    return lockPromise.then(dataResolver);
  };

  /**
   * Unlocks an investible
   * @param investibleId the id of the investible unlocked
   * @returns {PromiseLike<T> | Promise<T>} the result of unlocking
   */
  this.unlock = function (investibleId) {
    const unlockPromise = client.doPatch(SUBDOMAIN, 'unlock/'+investibleId);
    return unlockPromise.then(dataResolver);
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
   * @param addressed collection in the form of user_id, is_following
   * @returns {PromiseLike<T> | Promise<T>} the result of the follow/unfollow
   */
  this.follow = function (investibleId, addressed) {
    let body = { addressed };
    const path = 'follow/' + investibleId;
    const followPromise = client.doPatch(SUBDOMAIN, path, undefined, body);
    return followPromise.then(dataResolver);
  };

  /**
   * Creates a comment for an investible
   * @param investibleId the id of the investible to create the comment for or null for market level
   * @param groupId the id of the group to which the comment belongs. May not be null
   * @param body html body of the comment
   * @param replyId comment_id of the parent comment
   * @param commentType QUESTION, ISSUE, SUGGEST, JUSTIFY
   * @param uploadedFiles the file upload metadata
   * @param mentions list of people mentioned in the comment
   * @param notificationType over rides normal notification level
   * @param marketType type of inline market to create
   * @param isRestricted for inline initiative
   * @param isSent false is draft mode
   * @param investibleLabel label to apply to the parent investible
   * @returns {PromiseLike<T> | Promise<T>} resolution_id result
   */
  this.createComment = function(investibleId, groupId, body, replyId, commentType, uploadedFiles, mentions, notificationType,
                                marketType, isRestricted, isSent, investibleLabel) {
    const path = investibleId ? investibleId + '/comment' : 'comment';
    const msgBody = {
      group_id: groupId,
      body: body
    };
    if (commentType) {
      msgBody.comment_type = commentType;
    }
    if (notificationType) {
      msgBody.notification_type = notificationType;
    }
    if (marketType) {
      msgBody.market_type = marketType;
    }
    if (replyId) {
      msgBody.comment_type = 'REPLY';
      msgBody.reply_id = replyId;
    }
    if (Array.isArray(uploadedFiles)) {
      msgBody.uploaded_files = uploadedFiles;
    }
    if (Array.isArray(mentions)) {
      msgBody.mentions = mentions;
    }
    if (isRestricted !== undefined) {
      msgBody.is_restricted = isRestricted;
    }
    if (isSent !== undefined) {
      msgBody.is_sent = isSent;
    }
    if (investibleLabel !== undefined) {
      msgBody.investible_label = investibleLabel;
    }
    const commentPromise = client.doPost(SUBDOMAIN, path, undefined, msgBody);
    return commentPromise.then(dataResolver);
  };

  /**
   * Updates a comment
   * @param commentId the id of the comment to update
   * @param body html body of the comment
   * @param isResolved Whether to resolve comment or unresolve comment
   * @param uploadedFiles the file upload metadata
   * @param mentions
   * @param commentType comment type
   * @param notificationType over rides normal notification level
   * @param isSent whether comment visible to more than creator yet
   * @param investibleLabel label to apply to parent investible - wipes out any other label present
   * @returns {PromiseLike<T> | Promise<T>} resulting comment
   */
  this.updateComment = function(commentId, body, isResolved, uploadedFiles, mentions, commentType, notificationType,
                                isSent, investibleLabel) {
    const path = 'comment/' + commentId;
    const msgBody = {};
    if (body) {
      msgBody.body = body;
    }
    if (isResolved !== undefined) {
      msgBody.is_resolved = isResolved;
    }
    if (notificationType) {
      msgBody.notification_type = notificationType;
    }
    if (Array.isArray(uploadedFiles)) {
      msgBody.uploaded_files = uploadedFiles;
    }

    if (Array.isArray(mentions)) {
      msgBody.mentions = mentions;
    }
    if (commentType) {
      msgBody.comment_type = commentType;
    }
    if (isSent !== undefined) {
      msgBody.is_sent = isSent;
    }
    if (investibleLabel !== undefined) {
      msgBody.investible_label = investibleLabel;
    }
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
   * Historically comments lived in the investible services, so we create and fetch all comments
   * in this service.
   * Fetches the given comments present in on an object of the given market. The maximum number of comments
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

  /**
   * Adds attachments to the given investible
   * @param investibleId the id of the investible to add attachments to
   * @param files the files to add (represented as a browser file object such
   * as you get from a file upload form)
   * @returns {Promise<any>}
   */
  this.addAttachments = function(investibleId, files){
    const path = `${investibleId}/add_attachments`;
    const body = {
        files,
    };
    const patchPromise = client.doPatch(SUBDOMAIN, path, undefined, body);
    return patchPromise.then(dataResolver);
  }

  /**
   * Removes the attachments corresponding to the list of paths provided
   * @param investibleId the investible to delete the paths from
   * @param pathsToDelete and array of paths to delete
   * @returns {Promise<any>}
   */
  this.deleteAttachments = function(investibleId, pathsToDelete) {
    const path = `${investibleId}/delete_attachments`;
    const body = {
      files: pathsToDelete,
    };
    const patchPromise = client.doPatch(SUBDOMAIN, path, undefined, body);
    return patchPromise.then(dataResolver);
  }

    /**
     * Asks the server for the metadata of where to store a file of content type and content length.
     * Return value includes the path, url, metadata, and necessary fields that must be present
     * @param contentType content type of the file
     * @param contentLength size of the file in bytes
     * @param originalName the original name of the file on the user's system (optional)
     * @returns {PromiseLike<T | never> | Promise<T | never>}
     */
  this.getFileUploadData = function(contentType, contentLength, originalName) {
    const path = 'upload';
    const body = {
        content_type: contentType,
        content_length: contentLength
    };
    if (!_.isEmpty(originalName)) {
      body.original_name = originalName;
    }
    const postPromise = client.doPost(SUBDOMAIN, path, undefined, body);
    return postPromise.then(dataResolver);
  };

  /**
   * Refreshes the file tokens prpvided
   * @param oldTokens the old tokens you need refreshed
   * @return {PromiseLike<T | never> | Promise<T | never>}
   */
  this.refreshFileTokens = function(oldTokens) {
    const path = 'refresh_file_tokens';
    const body = {
      old_tokens: oldTokens,
    };
    const postPromise = client.doPost(SUBDOMAIN, path, undefined, body);
    return postPromise.then(dataResolver);
  }

}

export default Investibles;