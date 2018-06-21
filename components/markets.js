function Markets(client){

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
        const path = "markets/" + marketId + "/invite";
        const invitePromise = client.doPost(path, undefined, body);
        return invitePromise.then((result) => { return result.data });
    };

}

module.exports = (client) => {
    let myMarkets = new Markets(client);
    return myMarkets;
};