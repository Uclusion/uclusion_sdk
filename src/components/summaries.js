import { dataResolver } from './utils';

/**
 * Module representing the summaries api
 * @param client the configured fetch client
 * @constructor
 */
export function Summaries(client){

  const SUBDOMAIN = 'summaries';

  /**
   * Information about versions of all markets and notifications available to the identity in the idToken.
   * This method does not use an authorization header.
   * @param idToken Cognito ID token
   * @returns {PromiseLike<T> | Promise<T>} a dictionary of login info keyed by market IDs
   */
  this.versions = function(idToken) {
    const versionsPromise = client.doGet(SUBDOMAIN, 'versions', {idToken});
    return versionsPromise.then(dataResolver);
  };
}