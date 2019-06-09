/**
 * Module for the teams api
 * @param client the configured fetch client
 * @constructor
 */
export function Teams(client) {

  const SUBDOMAIN = 'teams';

  /**
   * Unpacks a result body and returns just the data portion
   * @param result the result body
   * @returns {*} the data portion of the body
   */
  const dataResolver = (result) => {
    return result.data;
  };


  /**
   * Creates a team
   * @param name name of the team
   * @param description description of the team
   * @returns {PromiseLike<T> | Promise<T>} created team
   */
  this.create = function (name, description) {
    const body = {
      name: name,
      description: description
    };
    const createPromise = client.doPost(SUBDOMAIN, 'create', undefined, body);
    return createPromise.then(dataResolver);
  };

  /**
   * Follows or unfollows the given team
   * @param teamId to follow/unfollow investments of
   * @param stopFollowing whether or not to STOP following the market.
   * @returns {PromiseLike<T> | Promise<T>} the result of the follow/unfollow
   */
  this.followTeam = function (teamId, stopFollowing) {
    let body = {};
    if (stopFollowing) {
      body.remove = true;
    }
    const path = teamId + '/follow';
    const followPromise = client.doPatch(SUBDOMAIN, path, undefined, body);
    return followPromise.then(dataResolver);
  };

  /**
   * Allows a team to make investments in a market
   * @param teamId the id of the team making the investment
   * @param roleOptions object with the following form:
   * <ul>
   *  <li>allowedRoles: array</li>
   *  <li>isCognito: boolean</li>
   * </ul>
   * @returns {PromiseLike<T> | Promise<T>} the result of the bind
   */
  this.bind = function (teamId, roleOptions) {
    const path = teamId + '/bind';
    let body = {};
    if (roleOptions && roleOptions.allowedRoles) {
      body.allowed_roles = roleOptions.allowedRoles;
    }
    if (roleOptions && roleOptions.isCognito) {
      body.auth_type = 'COGNITO';
    }
    const createPromise = client.doPost(SUBDOMAIN, path, null, body);
    return createPromise.then(dataResolver);
  };

  /**
   * Allows anonymous access to a market
   * @returns {PromiseLike<T> | Promise<T>} the result of the bind
   */
  this.bindAnonymous = function () {
    const path = 'bind';
    const createPromise = client.doPost(SUBDOMAIN, path, null, {});
    return createPromise.then(dataResolver);
  };

  /**
   * Gets a team and a list of user IDs that belong to it
   * @param teamId ID of the team to get
   * @returns {PromiseLike<T> | Promise<T>}
   */
  this.get = function (teamId) {
    const getPromise = client.doGet(SUBDOMAIN, teamId);
    return getPromise.then(dataResolver);
  };

  /**
   * Lists all teams in a market
   * @returns {PromiseLike<T> | Promise<T>}
   */
  this.list = function () {
    const path = 'list';
    const getPromise = client.doGet(SUBDOMAIN, path);
    return getPromise.then(dataResolver);
  };

  /**
   * Gets an invite token for this team
   * @param teamId to put in the signed token
   * @returns {PromiseLike<T> | Promise<T>} signed token allowing adding a user to this team
   */
  this.inviteToken = function (teamId) {
    const path = 'invite/' + teamId;
    const getPromise = client.doGet(SUBDOMAIN, path);
    return getPromise.then(dataResolver);
  };

  /**
   * Lists ROI
   * @param teamId Team to list ROI for
   * @param resolutionId optional constraint
   * @returns {PromiseLike<T> | Promise<T>}
   */
  this.listRoi = function (teamId, resolutionId) {
    let path = 'roi/' + teamId;
    const queryParams = { resolutionId };
    const getPromise = client.doGet(SUBDOMAIN, path, queryParams);
    return getPromise.then(dataResolver);
  };

  /**
   * Lists all teams that the calling user is part of
   * @returns {PromiseLike<T> | Promise<T>}
   */
  this.mine = function () {
    let path = 'mine';
    const getPromise = client.doGet(SUBDOMAIN, path);
    return getPromise.then(dataResolver);
  };
}

export default Teams;