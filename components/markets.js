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

    /**
      * Creates an investment in the given investible and market with the specified number
      * of idea ideaShares
      * @param marketId the id of the market to make the investment inspect
      * @param investibleId the id of the investible to invest inspect
      * @param ideaSharesQuantity the number of idea shares to investible
      * @returns {PromiseLike<T> | Promise<T>} the result of the investment
      */
    this.createInvestment = function(marketId, investibleId, ideaSharesQuantity){
        const body = {
            quantity: ideaSharesQuantity,
            investible_id: investibleId
        };
        const path = 'markets/' + marketId + '/investments';
        const createPromise = client.doPost(path, undefined, body);
        return createPromise.then(dataResolver);
    }
    /**
      * Deletes an investment in the given investible and market
      * @param marketId the id of the market to make the investment inspect
      * @param investibleId the id of the investible to invest inspect
      * @returns {PromiseLike<T> | Promise<T>} the result of the delete
      */
    this.deleteInvestment = function(marketId, investmentId){
        const path = 'markets/' + marketId + '/investments/' + investmentId;
        const deletePromise = client.doDelete(path, undefined, undefined);
        return deletePromise.then(dataResolver);
    }

}

module.exports = (client) => {
    let myMarkets = new Markets(client);
    return myMarkets;
};
