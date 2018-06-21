function Markets(client){

    const dataResolver = (result) => { return result.data };
    /**
     * Invites a user, identified by email, to the given market, and assigns them a quantity of idea shares
     * @param marketId the market to invite the user to
     * @param email the email of the user to invite
     * @param ideaSharesQuantity the quantity of the shares
     * @returns the result of inviting the user
     */
    this.invite = function(marketId, email, ideaSharesQuantity){
        const body = {
            email: email,
            quantity: ideaSharesQuantity
        };
        const path = 'markets/' + marketId + '/invite';
        const invitePromise = client.doPost(path, undefined, body);
        return invitePromise.then(dataResolver);
    };

    /**
     * Grants the given number of idea shares in the given market to the given user
     * @param marketId the market to grant the idea shares in
     * @param userId the user to grant them to
     * @param ideaSharesQuantity the quantity of idea shares to grant
     * @returns {PromiseLike<T> | Promise<T>} the result of the grant
     */
    this.grant = function(marketId, userId, ideaSharesQuantity){
        const body = {
            quantity: ideaSharesQuantity
        };
        const path = 'markets/' + marketId + '/users/' + userId + '/grant';
        const grantPromise = client.doPost(path, undefined, body);
        return grantPromise.then(dataResolver);
    }

}

module.exports = (client) => {
    let myMarkets = new Markets(client);
    return myMarkets;
};