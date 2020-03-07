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
   * </ul>
   * Will overwrite any existing value
   * @returns {PromiseLike<T> | Promise<T>} the result of the update
   */
  this.update = function (userOptions) {
    const body = {};
    if (userOptions.name) {
      body.name = userOptions.name;
    }
    if (userOptions.uiPreferences) {
      body.ui_preferences = userOptions.uiPreferences;
    }
    if (userOptions.slackEnabled) {
      body.slack_enabled = userOptions.slackEnabled;
    }
    if (userOptions.slackDelay) {
      body.slack_delay = userOptions.slackDelay;
    }
    if (userOptions.emailEnabled) {
      body.email_enabled = userOptions.emailEnabled;
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
   * @returns {PromiseLike<T> | Promise<T>} success or failure of users add
   */
  this.addUsers = function (participants) {
    const body = {
      participants: participants
    };
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
   * @returns {PromiseLike<T> | Promise<T>} success or failure of users invite
   */
  this.inviteUsers = function (participants) {
    const body = {
      participants: participants
    };
    const addPromise = client.doPost(SUBDOMAIN, 'invite', undefined, body);
    return addPromise.then(dataResolver);
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
   * Sends a small message to another user but cannot send again till that message is acknowledged
   * @param userId user to poke
   * @param text message the poked user receives - 235 character max
   * @returns {PromiseLike<T> | Promise<T>} the result of the poke
   */
  this.poke = function(userId, text){
    const body = {
      text: text
    };
    const path = 'poke/' + userId;
    const pokePromise = client.doPost(SUBDOMAIN, path, undefined, body);
    return pokePromise.then(dataResolver);
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
   * @param tier the tier we're upgrading to
   */
  this.startSubscription = function(tier, paymentId) {
    const body = {
      tier,
    };
    if (paymentId) {
      body.payment_id = paymentId;
    }
    const subscribePromise = client.doPost(SUBDOMAIN, 'start_subscription', undefined, body);
    return subscribePromise.then(dataResolver);
  };

  /**
   * Use to remove notifications whose resolution depends on user presence
   * @param objectId of the notification
   * @param aType type of the notification
   * @param pokeType type of poke if applicable
   * @returns {PromiseLike<T> | Promise<T>} the result of the delete
   */
  this.removeNotification = function(objectId, aType, pokeType){
    let path = 'notification/' + aType + '/' + objectId;
    if (pokeType) {
      path += '/' + pokeType;
    }
    const removePromise = client.doDelete(SUBDOMAIN, path);
    return removePromise.then(dataResolver);
  };

  /**
   * Grants the given number of idea shares in the given market to the given user
   * @param userId the user to grant them to
   * @param ideaSharesQuantity the quantity of idea shares to grant
   * @returns {PromiseLike<T> | Promise<T>} the result of the grant
   */
  this.grant = function (userId, ideaSharesQuantity) {
    const body = {
      quantity: ideaSharesQuantity
    };
    const path = userId + '/grant';
    const grantPromise = client.doPatch(SUBDOMAIN, path, undefined, body);
    return grantPromise.then(dataResolver);
  };
}

export default Users;
