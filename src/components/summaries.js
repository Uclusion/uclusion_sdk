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
   * @param versionsString the version on to provide delta from
   * @returns {PromiseLike<T> | Promise<T>} a dictionary of login info keyed by market IDs
   */
  this.versions = function(idToken, versionsString) {
    const queryParams = {idToken};
    if (versionsString) {
      queryParams.versionsString = versionsString;
    }
    const versionsPromise = client.doGet(SUBDOMAIN, 'versions', queryParams);
    return versionsPromise.then(dataResolver);
  };

  /**
   * Information about notifications available to the identity in the idToken.
   * This method does not use an authorization header.
   * @param idToken Cognito ID token
   * @returns {PromiseLike<T> | Promise<T>} a dictionary of login info keyed by market IDs
   */
  this.notifications = function(idToken) {
    const versionsPromise = client.doGet(SUBDOMAIN, 'notify', {idToken});
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