let assert = require('assert');

let testConfig = {
    baseURL: 'http://localhost:3001',
    headers: {}
};

let client = require('../../components/axiosClient')(testConfig);
let investibles = require('../../components/investibles.js')(client);

//set up a simple http server for our tests
const express = require('express');
const app = express();
const port = 3001;
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
app.use(bodyParser.json());
