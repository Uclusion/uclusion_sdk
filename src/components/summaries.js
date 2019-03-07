/**
 * Module representing the summaries api
 * @param client the configured fetch client
 * @constructor
 */
export function Summaries(client){

  const SUBDOMAIN='summaries';

  /**
   * Unpacks a result body and returns just the data portion
   * @param result the result body
   * @returns {*} the data portion of the body
   */
  const dataResolver = (result) => { return result.data };

  /**
   * Fetches the market summary data for the market.
   * The returned list will <i>not<i> be in sorted order
   * @param marketId
   * @returns {PromiseLike<T> | Promise<T>} a promise resolving to a hash structure
   * of the form {'market_id': marketId, 'summaries':[summary array]}
   */
  this.marketSummary = function(marketId){
    const path = 'markets/' + marketId;
    const getPromise = client.doGet(SUBDOMAIN, path);
    return getPromise.then(dataResolver);
  }
}