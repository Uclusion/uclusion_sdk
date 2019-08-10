import { dataResolver } from './utils';

/**
 * Module for the users api
 * @param client the configured fetch client
 * @constructor
 */
export function Users(client) {

  const SUBDOMAIN = 'users';

  /**
   * Updates the current user with the given name
   * @param name the new name of the user
   * @param ui_preferences Optional String argument: ui_preferences any UI preferences to update.
   * Will overwrite any existing value
   * @returns {PromiseLike<T> | Promise<T>} the result of the update
   */
  this.update = function (name, ui_preferences) {
    const body = {
      name,
      ui_preferences
    };
    const updatePromise = client.doPatch(SUBDOMAIN, 'update', undefined, body);
    return updatePromise.then(dataResolver);
  };

  /**
   * Updates another user. Options is an object with the following form
   * <ul>
   *  <li>name : string</li>
   *  <li>defaultMarketId: string</li>
   *  <li>accountRole: enum</li>
   * </ul>
   * @param userId user_id of the user to update
   * @param userOptions the options for the market
   * @returns {PromiseLike<T> | Promise<T>} the result of the update
   */
  this.updateUser = function (userId, userOptions) {
    let path = 'update/' + userId;
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
   * Gets a user's definition given it's ID or null for invoking user
   * @param userId which can be null to get yourself
   * @returns {PromiseLike<T> | Promise<T>} the user's information
   */
  this.get = function (userId) {
    let path = 'get/';
    if (userId) {
      path += userId;
    }

    const getPromise = client.doGet(SUBDOMAIN, path);
    return getPromise.then(dataResolver);
  };

  /**
   * Gets a user's presences
   * @param userId which can be empty to get yourself
   * @returns {PromiseLike<T> | Promise<T>} the user's information
   */
  this.getPresences = function (userId) {
    let path = 'presences/';
    if (userId) {
      path += userId;
    }
    const getPromise = client.doGet(SUBDOMAIN, path);
    return getPromise.then(dataResolver);
  };

  /**
   * Gets a user's own messages
   * @returns {PromiseLike<T> | Promise<T>} list of messages
   */
  this.getMessages = function () {
    let path = 'messages';
    const getPromise = client.doGet(SUBDOMAIN, path);
    return getPromise.then(dataResolver);
  };

  /**
   * Sends a small message to another user but cannot send again till that message is manually acknowledged
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
   * Removes the current user from the logged into market
   * @returns {PromiseLike<T> | Promise<T>} the result of the delete
   */
  this.delete = function () {
    const deletePromise = client.doDelete(SUBDOMAIN, 'delete');
    return deletePromise.then(dataResolver);
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

  /**
   * Removes a message from a user's unacknowledged list of notifications
   * @param objectId the object_id of the message to acknowledge
   * @param type the type of object_id
   * @returns {PromiseLike<T> | Promise<T>} the result of the acknowledge
   */
  this.acknowledge = function (objectId, type) {
    const body = {
      object_id: objectId,
      type: type
    };
    const path = 'ack';
    const ackPromise = client.doPatch(SUBDOMAIN, path, undefined, body);
    return ackPromise.then(dataResolver);
  };
}

export default Users;