export function Teams(client) {

    const SUBDOMAIN = 'teams';

    const dataResolver = (result) => { return result.data };

    /**
     * Creates a team
     * @param name name of the team
     * @param description description of the team
     * @returns {PromiseLike<T> | Promise<T>} the result of the investment
     */
    this.create = function(name, description){
        const body = {
            name: name,
            description: description
        };
        const createPromise = client.doPost(SUBDOMAIN, 'create', undefined, body);
        return createPromise.then(dataResolver);
    };

    /**
     * Allows a team to make investments in a market
     * @param teamId the id of the team making the investment
     * @param marketId the id of the market to make the investment inspect
     * @param roleOptions object with the following form:
     * <ul>
     *  <li>allowedRoles: array</li>
     *  <li>isCognito: boolean</li>
     * </ul>
     * @returns {PromiseLike<T> | Promise<T>} the result of the bind
     */
    this.bind = function(teamId, marketId, roleOptions){
        const path = teamId + '/bind/' + marketId;
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
     * @param marketId the id of the market to make the investment inspect
     * @returns {PromiseLike<T> | Promise<T>} the result of the bind
     */
    this.bindAnonymous = function(marketId){
        const path = 'bind/' + marketId;
        const createPromise = client.doPost(SUBDOMAIN, path, null, {});
        return createPromise.then(dataResolver);
    };

    /**
     * Gets a team and a list of user IDs that belong to it
     * @param teamId ID of the team to get
     * @returns {PromiseLike<T> | Promise<T>}
     */
    this.get = function(teamId) {
        const getPromise = client.doGet(SUBDOMAIN, teamId);
        return getPromise.then(dataResolver);
    };

    /**
     * Lists all teams in a market
     * @param marketId the id of the market to list teams of
     * @returns {PromiseLike<T> | Promise<T>}
     */
    this.list = function(marketId) {
        const path = 'list/' + marketId;
        const getPromise = client.doGet(SUBDOMAIN, path);
        return getPromise.then(dataResolver);
    };

    /**
     * Lists all investments of a team in a market
     * @param teamId the id of the team to list investments of
     * @param marketId the id of the market to list investments of
     * @returns {PromiseLike<T> | Promise<T>} Dictionary of investible IDs and investment amounts
     */
    this.investments = function(teamId, marketId) {
        const path = teamId + '/investments/' + marketId;
        const getPromise = client.doGet(SUBDOMAIN, path);
        return getPromise.then(dataResolver);
    };

    /**
     * Lists ROI
     * @param teamId Team to list ROI for
     * @param marketId Market to list ROI for
     * @param resolutionId optional constraint
     * @returns {PromiseLike<T> | Promise<T>}
     */
    this.listRoi = function(teamId, marketId, resolutionId) {
        let path = 'roi/' + teamId;
        let queryParams = {marketId: marketId};
        if (resolutionId) {
            queryParams.resolutionId = resolutionId;
        }
        const getPromise = client.doGet(SUBDOMAIN, path, queryParams);
        return getPromise.then(dataResolver);
    };

    /**
     * Lists all teams that the calling user is part of
     * @param marketId The market to provide team summary information for
     * @returns {PromiseLike<T> | Promise<T>}
     */
    this.mine = function(marketId) {
        let path = 'mine/' + marketId;
        const getPromise = client.doGet(SUBDOMAIN, path);
        return getPromise.then(dataResolver);
    };
}

export default Teams;