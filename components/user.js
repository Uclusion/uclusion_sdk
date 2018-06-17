


let user = function(client){
    this.client = client;
}

user.delete = function(reason){
    const body = {
        reason: reason
    };
    const path = "users"
    const request = () => {this.client.doDelete(path, body)};
    return resultHandler(request);
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



user.get = function(userId){
    const path = "users/" + userId;
    const success = (message) => {

    }
}

module.exports = user;