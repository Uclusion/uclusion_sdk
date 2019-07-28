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
   * Creates a user
   * @param name name of the user
   * @param email email of the user
   * @param ui_preferences Optional string argument containing any ui preferences
   * @returns {PromiseLike<T> | Promise<T>} created user
   */
  this.create = function (name, email, ui_preferences) {
    let path = 'create';
    const body = {
      name,
      email,
      ui_preferences
    };
    const createPromise = client.doPost(SUBDOMAIN, path, undefined, body);
    return createPromise.then(dataResolver);
  };

  /**
   * Deletes the current user from uclusion
   * @param reason why the user is deleting themselves
   * @returns {PromiseLike<T> | Promise<T>} the result of the delete
   */
  this.delete = function (reason) {
    const body = {
      reason
    };
    const deletePromise = client.doDelete(SUBDOMAIN, 'delete', undefined, body);
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
}

export default Users;