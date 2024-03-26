import { dataResolver } from './utils';

/**
 * Module for the users api
 * @param client the configured fetch client
 * @constructor
 */
export function Users(client) {

  const SUBDOMAIN = 'users';

  /**
   * Updates the current user with the given name. Options is an object with the following form
   * <ul>
   *  <li>name : string</li>
   *  <li>ui_preferences: dictionary</li>
   *  <li>slackEnabled: bool</li>
   *  <li>emailEnabled: bool</li>
   *  <li>emailDelay: non negative integer</li>
   *  <li>slackDelay: non negative integer</li>
   * </ul>
   * Will overwrite any existing value
   * @returns {PromiseLike<T> | Promise<T>} the result of the update
   */
  this.update = function (userOptions) {
    const body = {};
    if (userOptions.name) {
      body.name = userOptions.name;
    }
    if (userOptions.marketId) {
      body.market_id = userOptions.marketId;
    }
    if (userOptions.uiPreferences) {
      body.ui_preferences = userOptions.uiPreferences;
    }
    if (userOptions.slackEnabled !== undefined) {
      body.slack_enabled = userOptions.slackEnabled;
    }
    if (userOptions.slackDelay !== undefined) {
      body.slack_delay = userOptions.slackDelay;
    }
    if (userOptions.emailDelay !== undefined) {
      body.email_delay = userOptions.emailDelay;
    }
    if (userOptions.emailEnabled !== undefined) {
      body.email_enabled = userOptions.emailEnabled;
    }
    if (userOptions.clearNotificationConfigs !== undefined) {
      body.clear_notification_configs = userOptions.clearNotificationConfigs;
    }
    const updatePromise = client.doPatch(SUBDOMAIN, 'update', undefined, body);
    return updatePromise.then(dataResolver);
  };

  /**
   * Adds lists of participants to a market. Participants of form:
   * <ul>
   *  <li>user_id : string</li>
   *  <li>account_id: string</li>
   *  <li>is_observer: bool</li>
   * </ul>
   * @param participants list max 50 length
   * @param marketSubType
   * @returns {PromiseLike<T> | Promise<T>} success or failure of users add
   */
  this.addUsers = function(participants, marketSubType) {
    const body = {
      participants: participants
    };
    if (marketSubType) {
      body.market_sub_type = marketSubType;
    }
    const addPromise = client.doPatch(SUBDOMAIN, 'add', undefined, body);
    return addPromise.then(dataResolver);
  };

  /**
   * Invites lists of participants to a market. Participants of form:
   * <ul>
   *  <li>email: string</li>
   *  <li>is_observer: bool</li>
   * </ul>
   * @param participants list max 50 length
   * @param groupId Optional group to put the new users in
   * @returns {PromiseLike<T> | Promise<T>} success or failure of users invite
   */
  this.inviteUsers = function(participants, groupId) {
    const body = {
      participants: participants
    };
    if (groupId) {
      body.group_id = groupId;
    }
    const addPromise = client.doPost(SUBDOMAIN, 'invite', undefined, body);
    return addPromise.then(dataResolver);
  };

  /**
   * Bans or unbans a user from the market. A banned user can't login, and the authorizer
   * will reject their calls when it's cache expires
   * @param userId the user id to ban from the market
   * @param isBanned boolean if they are banned
   * @returns {PromiseLike<T> | Promise<T>}
   */
  this.banUser = function(userId, isBanned) {
    const path = 'ban/' + userId;
    const body = {
      is_banned: isBanned,
    };
    const banPromise = client.doPost(SUBDOMAIN, path, undefined, body);
    return banPromise.then(dataResolver);
  };

  /**
   * Integration testing API to remove referred users from an account
   * @returns {PromiseLike<any> | Promise<any>}
   */
  this.cleanAccount = function() {
    const cleanPromise = client.doPost(SUBDOMAIN, 'clean');
    return cleanPromise.then(dataResolver);
  };

  /**
  /**
   * Updates another user. Options is an object with the following form
   * <ul>
   *  <li>name : string</li>
   *  <li>accountRole: enum</li>
   * </ul>
   * @param userId user_id of the user to update
   * @param userOptions the options for the market
   * @returns {PromiseLike<T> | Promise<T>} the result of the update
   */
  this.updateUser = function (userId, userOptions) {
    const path = 'update/' + userId;
    const body = {};
    if (userOptions.name) {
      body.name = userOptions.name;
    }
    if (userOptions.accountRole) {
      body.account_role = userOptions.accountRole;
    }
    const updatePromise = client.doPatch(SUBDOMAIN, path, undefined, body);
    return updatePromise.then(dataResolver);
  };

  /**
   * Gets a user's definition
   * @returns {PromiseLike<T> | Promise<T>} the user's information
   */
  this.get = function () {
    const getPromise = client.doGet(SUBDOMAIN, 'get');
    return getPromise.then(dataResolver);
  };

  /**
   * Gets a user's payment info
   * @returns {PromiseLike<T> | Promise<T>} the user's payment information
   */
  this.getPaymentInfo = function () {
    const getPromise = client.doGet(SUBDOMAIN, 'current_payment');
    return getPromise.then(dataResolver);
  };

  /**
   * Gets all the invoices for the user's account
   * @returns {PromiseLike<T> | Promise<T>}
   */
  this.getInvoices = function () {
    const getPromise = client.doGet(SUBDOMAIN, 'payment_invoices');
    return getPromise.then(dataResolver);
  };

  /**
   * Cancels a user's subscription. If you are a member of an organization
   * and your account is _not_ the billing account for an organization,
   * then bad things will happen (at best an exception).
   */
  this.cancelSubscription = function () {
    const deletePromise = client.doDelete(SUBDOMAIN, 'cancel_subscription');
    return deletePromise.then(dataResolver);
  };


  /**
   * Adds a promotion code to the users subscription. No useful data
   * is returned, but there's a success message if you need it
   * @param promoCode the promo code to add
   * @returns {PromiseLike<T> | Promise<T>}
   */
  this.addPromoToSubscription = function (promoCode) {
    const body = {
      promo_code: promoCode,
    };

    const addPromise = client.doPost(SUBDOMAIN, 'add_promo_to_sub', undefined, body);
    return addPromise.then(dataResolver);
  };

  /**
   * Restarts a subscription
   * @param paymentId the id returned from the payment processor
   * @param promoCode any promo code we have
   * @returns {PromiseLike<T> | Promise<T>}
   */
  this.restartSubscription = function (paymentId, promoCode) {
    const body = {
      payment_id: paymentId,
    };
    if (promoCode) {
      body.promo_code = promoCode;
    }
    const postPromise = client.doPost(SUBDOMAIN, 'restart_subscription', undefined, body);
    return postPromise.then(dataResolver);
  };

  /**
   * Associates a user with the Slack user with that nonce
   * @param nonce of the Slack user already stored
   * @returns {PromiseLike<T> | Promise<T>} the result of the registration
   */
  this.register = function(nonce){
    const body = {
      nonce: nonce
    };
    const registerPromise = client.doPost(SUBDOMAIN, 'slack', undefined, body);
    return registerPromise.then(dataResolver);
  };

  /**
   * Validates the passed in promo code to see if it can be used
   * @param promoCode the promo code to validate
   * @returns {PromiseLike<any> | Promise<any>}
   */
  this.validatePromoCode = function(promoCode) {
    const body = {
      promo_code: promoCode
    };
    const validatePromise = client.doPost(SUBDOMAIN, 'validate_promo_code', undefined, body)
    return validatePromise.then(dataResolver);
  }

  /**
   * Updates the payment information for the user
   * @param paymentId
   * @returns {PromiseLike<T> | Promise<T>}
   */
  this.updatePaymentInfo = function(paymentId) {
    const body = {
      payment_id: paymentId,
    };
    const updatePromise = client.doPost(SUBDOMAIN, 'update_payment', undefined, body);
    return updatePromise.then(dataResolver);
  };

  /**
   * Starts a subscription
   * @param paymentId optional id if the payment has already been made
   * @param promoCode any promo code we have
   * @param isTest Used by integration tests to clear existing subscription
   */
  this.startSubscription = function(paymentId, promoCode, isTest) {
    const body = {};
    if (paymentId) {
      body.payment_id = paymentId;
    }
    if (promoCode) {
      body.promo_code = promoCode;
    }
    if (isTest) {
      body.is_test = isTest;
    }
    const subscribePromise = client.doPost(SUBDOMAIN, 'start_subscription', undefined, body);
    return subscribePromise.then(dataResolver);
  };

  /**
   * Use to remove read notification or remove highlighting of persistent notification
   * @returns {PromiseLike<T> | Promise<T>} the result of the delete
   */
  this.removeNotification = function(typeObjectId){
    return this.removeNotifications([typeObjectId]);
  };

  /**
   * Use to remove read notifications or remove highlighting of persistent notifications
   * @returns {PromiseLike<T> | Promise<T>} the result of the delete
   */
  this.removeNotifications = function(typeObjectIds){
    const path = 'removenotification';
    const queryParams = {type_object_id: typeObjectIds};
    const removePromise = client.doDelete(SUBDOMAIN, path, queryParams);
    return removePromise.then(dataResolver);
  };

  /**
   * Use to dehighlight notifications
   * @returns {PromiseLike<T> | Promise<T>} the result of the dehighlight
   */
  this.dehighlightNotifications = function(typeObjectIds){
    const path = 'dehighlight';
    const queryParams = {type_object_id: typeObjectIds};
    const removePromise = client.doPatch(SUBDOMAIN, path, queryParams);
    return removePromise.then(dataResolver);
  };

  /**
   * Use to poke responders of comment
   * @returns {PromiseLike<T> | Promise<T>} the result of the highlighting
   */
  this.pokeComment = function(commentId){
    const path = 'pokecomment/' + commentId;
    const highlightPromise = client.doPatch(SUBDOMAIN, path, {});
    return highlightPromise.then(dataResolver);
  };

  /**
   * Use to poke approvers or assignees of investible
   * @returns {PromiseLike<T> | Promise<T>} the result of the highlighting
   */
  this.pokeInvestible = function(investibleId){
    const path = 'pokeinvestible/' + investibleId;
    const highlightPromise = client.doPatch(SUBDOMAIN, path, {});
    return highlightPromise.then(dataResolver);
  };
}

export default Users;
