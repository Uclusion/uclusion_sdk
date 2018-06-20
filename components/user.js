

function User(client) {

    this.delete = function (reason) {
        const body = {
            reason: reason
        };
        const path = "users"
    }
    /* Commented out pending proper understanding of what the function call should look like
    user.invite = function(marketId, email, ideaSharesQuantity){
        let body = {
            email: email,
            quantity: ideaSharesQuantity
        }
        let path = "users"
        this.client.doPost(path, body);
    }
    */

    /**
     * Gets a user's definition given it's ID
     * @param userId
     */
    this.get = function (userId) {
        const path = "users/" + userId;
        const getPromise = client.doGet(path);
        return getPromise.then((result) => { return result.data });
    };

    this.delete = function () {
        const path = "users";
        const getPromise.then((result) => { return result.data });
    }
}

module.exports = (client) => {
    let myUser = new User(client);
    return myUser;
};
