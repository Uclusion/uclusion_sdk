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
   * @param uploadedFiles the metadata about files uploaded to this investible
   * @param assignments set of user IDs
   * @param estimate days estimate
   * @returns {PromiseLike<T> | Promise<T>} result of creating an investible
   */
  this.create = function (investibleName, investibleDescription, uploadedFiles, assignments,
                          estimate) {
    const body = {
      name: investibleName,
      description: investibleDescription
    };
    if (uploadedFiles) {
      body.uploaded_files = uploadedFiles;
    }
    if (assignments) {
      body.assignments = assignments;
    }
    if (estimate) {
      body.days_estimate = estimate;
    }
    const createPromise = client.doPost(SUBDOMAIN, 'create', undefined, body);
    return createPromise.then(dataResolver);
  };

  /**
   * Shares an investible from another dialog
   * @param investibleId ID of the investible to share with another dialog
   * @returns {PromiseLike<T> | Promise<T>} result of creating an investible in this dialog
   */
  this.share = function (investibleId) {
    const body = {
      investible_id: investibleId
    };
    const sharePromise = client.doPost(SUBDOMAIN, 'create', undefined, body);
    return sharePromise.then(dataResolver);
  };

  /**
   * Copies an investible
   * @param investibleId id of investible to copy
   * @param marketId id of the market to copy into
   * @returns {PromiseLike<T> | Promise<T>} id of created investible
   */
  this.copy = function (investibleId, marketId) {
    const path = 'copy/' + investibleId + '/tomarket/' + marketId;
    const copyPromise = client.doPost(SUBDOMAIN, path);
    return copyPromise.then(dataResolver);
  };

  /**
   * Updates an investible with name, description, and categories - requires a lock
   * @param investibleId the id of the investible updated
   * @param investibleName name of investible
   * @param investibleDescription description of investible
   * @param labelList list of labels
   * @param uploadedFiles the files to upload
   * @param estimate days estimate
   * @returns {PromiseLike<T> | Promise<T>} result of updating investible
   */
  this.update = function (investibleId, investibleName, investibleDescription, labelList, uploadedFiles, estimate) {
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
    if (Array.isArray(uploadedFiles) && uploadedFiles.length > 0) {
      body.uploaded_files = uploadedFiles;
    }
    if (estimate) {
      body.days_estimate = estimate;
    }
    const updatePromise = client.doPatch(SUBDOMAIN, investibleId, undefined, body);
    return updatePromise.then(dataResolver);
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
   * Historically comments lived in the investible, so create and
   * get all comments in a market in this service.
   * Creates a comment for the
   * @param body the html body of the comment
   * @param replyId comment id of the parent comment
   * @param commentType QUESTION, ISSUE, SUGGEST, JUSTIFY
   * @param uploadedFiles the file upload metadata
   * @returns {*}
   */
  this.createMarketComment = function (body, replyId, commentType, uploadedFiles) {
    return this.createComment(undefined, body, replyId, commentType, uploadedFiles);
  };


  /**
   * Creates a comment for an investible
   * @param investibleId the id of the investible to create the comment for or null for market level
   * @param body html body of the comment
   * @param replyId comment_id of the parent comment
   * @param commentType QUESTION, ISSUE, SUGGEST, JUSTIFY
   * @param uploadedFiles the file upload metadata
   * @param notificationType over rides normal notification level
   * @returns {PromiseLike<T> | Promise<T>} resolution_id result
   */
  this.createComment = function (investibleId, body, replyId, commentType, uploadedFiles, notificationType) {
    const path = investibleId ? investibleId + '/comment' : 'comment';
    const msgBody = {
      body: body
    };
    if (commentType) {
      msgBody.comment_type = commentType;
    }
    if (notificationType) {
      msgBody.notification_type = notificationType;
    }
    if (replyId) {
      msgBody.comment_type = 'REPLY';
      msgBody.reply_id = replyId;
    }
    if (uploadedFiles) {
      msgBody.uploaded_files = uploadedFiles;
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
   * @param commentType comment type
   * @param notificationType over rides normal notification level
   * @returns {PromiseLike<T> | Promise<T>} resulting comment
   */
  this.updateComment = function (commentId, body, isResolved, uploadedFiles, commentType, notificationType) {
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
    if (uploadedFiles) {
      msgBody.uploaded_files = uploadedFiles;
    }
    if (commentType) {
      msgBody.comment_type = commentType;
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