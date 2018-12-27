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
     *  <li>default_role: string, <b>required</b></li>
     *  <li>lead_role: string, <b>required</b></li>
     *  <li>allowed_roles: array</li>
     * </ul>
     * @returns {PromiseLike<T> | Promise<T>} the result of the bind
     */
    this.bind = function(teamId, marketId, roleOptions){
        const path = teamId + '/bind/' + marketId;
        const body = {
            default_role: roleOptions.default_role,
            lead_role: roleOptions.lead_role
        };
        if (roleOptions.allowed_roles) {
            body.allowed_roles = roleOptions.allowed_roles;
        }
        const createPromise = client.doPost(SUBDOMAIN, path, null, body);
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
     * Lists all teams associated with the calling user's account
     * @returns {PromiseLike<T> | Promise<T>}
     */
    this.list = function() {
        const getPromise = client.doGet(SUBDOMAIN, 'list');
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
     * @returns {PromiseLike<T> | Promise<T>}
     */
    this.mine = function() {
        const getPromise = client.doGet(SUBDOMAIN, 'mine');
        return getPromise.then(dataResolver);
    };
}

export default Teams;