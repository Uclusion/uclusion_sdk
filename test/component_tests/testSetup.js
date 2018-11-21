//npm stuff for node test env
let fetch = require('node-fetch');
global.fetch = fetch;


import { FetchClient } from '../../src/components/fetchClient.js';

const testAuthorizer = {
    authorize: () => {
        return new Promise((resolve, reject) => {
            resolve("foo");
        })
    },
    reauthorize: () => {
        return authorize();
    },
    getToken: () => {
        return "foo";
    }
};


let defaultConfig = {
    baseURL: 'http://localhost',
    headers: {},
    authorizer: testAuthorizer,
    domainMunger: (url, domain) => { return url} //don't do the sub domain addition
};


let serverCreator = () => {
//set up a simple http server for our tests
    const express = require('express');
    const app = express();
    const bodyParser = require('body-parser');
    app.use(bodyParser.json());
    const server = require('http').createServer(app);
    return {app, server};
};

let clientCreator = (server) => {
    server.listen();
    const { port } = server.address();
//    console.log(port)
    const { baseURL } = defaultConfig;
    const newConfig = {...defaultConfig, baseURL: baseURL + ':' + port};
    const client = new FetchClient(newConfig);
//    console.log(server.listening)
    return client;
};

export { serverCreator, clientCreator }