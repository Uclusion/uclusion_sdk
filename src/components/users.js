/**
 * Module for the users api
 * @param client the configured fetch client
 * @constructor
 */
export function Users(client) {

  const SUBDOMAIN = 'users';


  /**
   * Unpacks a result body and returns just the data portion
   * @param result the result body
   * @returns {*} the data portion of the body
   */
  const dataResolver = (result) => { return result.data };

  /**
   * Updates the current user with the given name
   * @param name the new name of the user
   * @param default_market_id Market ID to use for a user get when not specified
   * @param default_team_id Team ID to use for a user get when not specified
   * @param Optional String argument: ui_preferences any UI preferences to update.
   * Will overwrite any existing value
   * @returns {PromiseLike<T> | Promise<T>} the result of the update
   */
  this.update = function (name, default_market_id, default_team_id, ui_preferences) {
    const body = {
      name,
      default_market_id,
      default_team_id,
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
   *  <li>defaultTeamId: number</li>
   *  <li>teamId: string</li>
   *  <li>teamRole: enum</li>
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
    if (userOptions.defaultMarketId) {
      body.default_market_id = userOptions.defaultMarketId;
    }
    if (userOptions.defaultTeamId) {
      body.default_team_id = userOptions.defaultTeamId;
    }
    if (userOptions.accountRole) {
      body.account_role = userOptions.accountRole;
    }
    if (userOptions.teamId) {
      body.team_id = userOptions.teamId;
      body.team_role = userOptions.teamRole;
    }
    const updatePromise = client.doPatch(SUBDOMAIN, path, undefined, body);
    return updatePromise.then(dataResolver);
  };

  /**
   * Changes the team of the user
   * @param userId the user to move
   * @param oldTeamId Team user will be removed from
   * @param newTeamId Team user will be added to
   * @param teamRole Optional role user will have on new team
   * @returns {PromiseLike<T> | Promise<T>} the result of the move
   */
  this.moveUser = function (userId, oldTeamId, newTeamId, teamRole) {
    let path = 'move/' + userId;
    const body = {
      old_team_id: oldTeamId,
      new_team_id: newTeamId
    };
    if (teamRole) {
      body.team_role = teamRole;
    }
    const movePromise = client.doPatch(SUBDOMAIN, path, undefined, body);
    return movePromise.then(dataResolver);
  };

  /**
   * Gets a user's definition given it's ID or null for invoking user
   * @param userId which can be null to get yourself
   * @param marketId Market to pull user data from - defaults if not set and user has at least one market
   * @param teamId Team to pull data from - defaults if not set
   * @returns {PromiseLike<T> | Promise<T>} the user's information
   */
  this.get = function (userId, marketId, teamId) {
    let path = 'get/';
    if (userId) {
      path += userId;
    }
    let queryParams = {};
    if (marketId) {
      queryParams.marketId = marketId;
    }
    if (teamId) {
      queryParams.teamId = teamId;
    }
    const getPromise = client.doGet(SUBDOMAIN, path, queryParams);
    return getPromise.then(dataResolver);
  };

  /**
   * Gets a user's presences, team and market tree, given ID or empty for invoking user
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
   * @param teamId team to add the user to
   * @param name name of the user
   * @param email email of the user
   * @param Optional string argument containing any ui preferences
   * @returns {PromiseLike<T> | Promise<T>} created user
   */
  this.create = function (teamId, name, email, ui_preferences) {
    let path = 'create/' + teamId;
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
   * @param marketId the market to grant the idea shares in
   * @param ideaSharesQuantity the quantity of idea shares to grant
   * @returns {PromiseLike<T> | Promise<T>} the result of the grant
   */
  this.grant = function (userId, marketId, ideaSharesQuantity) {
    const body = {
      quantity: ideaSharesQuantity
    };
    const path = userId + '/grant/' + marketId;
    const grantPromise = client.doPatch(SUBDOMAIN, path, undefined, body);
    return grantPromise.then(dataResolver);
  };
}

export default Users;