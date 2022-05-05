import { dataResolver } from './utils';

/**
 * Module representing the summaries api
 * @param client the configured fetch client
 * @constructor
 */
export function Summaries(client){

  const SUBDOMAIN = 'summaries';

  /**
   * Information about versions of all market objects available to the identity in the idToken.
   * This method does not use an authorization header.
   * @param idToken Cognito ID token
   * @param idList the ids to retrieve object signatures for
   * @returns {PromiseLike<T> | Promise<T>} {'signatures'}
   */
  this.versions = function(idToken, idList) {
    const queryParams = {idToken, id: idList};
    const versionsPromise = client.doGet(SUBDOMAIN, 'versions', queryParams);
    return versionsPromise.then(dataResolver);
  };

  /**
   * Lists of dirty objects available to the identity in the idToken.
   * This method does not use an authorization header.
   * @param idToken Cognito ID token
   * @returns {PromiseLike<T> | Promise<T>} {'global_version', 'background', 'foreground', 'account', 'banned'}
   */
  this.idList = function(idToken) {
    const queryParams = {idToken};
    const versionsPromise = client.doGet(SUBDOMAIN, 'versioned', queryParams);
    return versionsPromise.then(dataResolver);
  };

  /**
   * Lists all of the summary data for the last year
   * @returns {PromiseLike<T | never> | Promise<T | never>} the list of summaries
   */
  this.getMarketSummary = function() {
    const getPromise = client.doGet(SUBDOMAIN, 'markets');
    return getPromise.then(dataResolver);
  };
}