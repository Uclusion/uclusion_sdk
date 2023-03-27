import { dataResolver } from './utils';

/**
 * Module representing the demo (tests) api
 * @param client the configured fetch client
 * @constructor
 */
export function Demo(client){

  const SUBDOMAIN = 'test';

  this.createDemo = function() {
    const getPromise = client.doGet(SUBDOMAIN, 'create_demo');
    return getPromise.then(dataResolver);
  };
}