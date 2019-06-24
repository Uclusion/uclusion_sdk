import { dataResolver } from './utils';

/**
 * Module representing the summaries api
 * @param client the configured fetch client
 * @constructor
 */
export function Summaries(client){

  const SUBDOMAIN = 'summaries';


  /**
   * Fetches the market summary data for the market.
   * The returned list will <i>not<i> be in sorted order
   * @returns {PromiseLike<T> | Promise<T>} a promise resolving to a hash structure
   * of the form {'market_id': marketId, 'summaries':[summary array]}
   */
  this.marketSummary = function(){
    const path = 'markets';
    const getPromise = client.doGet(SUBDOMAIN, path);
    return getPromise.then(dataResolver);
  }
}