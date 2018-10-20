function Teams(client) {

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
        const path = 'teams/' + teamId + '/invite/' + marketId;
        const invitePromise = client.doPost(SUBDOMAIN, path, undefined, body);
        return invitePromise.then(dataResolver);
    };


    /**
     * Allows a team to make investments in a market
     * @param teamId the id of the team making the investment
     * @param marketId the id of the market to make the investment inspect
     * @param sharedResources whether or not a team spends from a common pool of idea shares
     * @returns {PromiseLike<T> | Promise<T>} the result of the bind
     */
    this.bind = function(teamId, marketId, sharedResources){
        const body = {
            shared_resources: sharedResources
        };
        const path = 'teams/' + teamId + '/bind/' + marketId;
        const createPromise = client.doPost(SUBDOMAIN, path, undefined, body);
        return createPromise.then(dataResolver);
    };

}

let configuredTeams = (client) => {
    return new Teams(client);
};
//module.exports = configuredUsers;
export default configuredTeams;