export function Teams(client) {

    const SUBDOMAIN = 'teams';

    const dataResolver = (result) => { return result.data };

    /**
     * Invites a user for given team, identified by email, to the given market, and assigns them a quantity of idea shares
     * @param teamId Team to add user to
     * @param marketId the market to invite the user to
     * @param email the email of the user to inviter
     * @param ideaSharesQuantity How many idea shares to grant the user in marketId
     * @param isAdmin Whether or not the invited user should be made an admin
     * @returns the result of inviting the user
     */
        this.invite = function(teamId, marketId, email, ideaSharesQuantity, isAdmin){
        const body = {
            email: email,
            quantity: ideaSharesQuantity,
            is_admin: isAdmin
        };
        const path = teamId + '/invite/' + marketId;
        const invitePromise = client.doPost(SUBDOMAIN, path, undefined, body);
        return invitePromise.then(dataResolver);
    };

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
     * @param quantity the quantity of shares to grant the team
     * @returns {PromiseLike<T> | Promise<T>} the result of the bind
     */
    this.bind = function(teamId, marketId, quantity){
        const path = teamId + '/bind/' + marketId;
        const body = {quantity: quantity};
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