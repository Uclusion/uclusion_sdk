function Ivestibles(client){

    const dataResolver = (result) => { return result.data };

}

module.exports = (client) => {
    let myInvestibles = new Investibles(client);
    return myInvestibles;
};
