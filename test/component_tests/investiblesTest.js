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

app.patch('/markets/asdf1/investibles/jfkd1/resolve', (request, response) => {
    response.json({success_message: 'Investible resolved'});
});

app.patch('/markets/asdf2/investibles/jfkd2/follow', (request, response) => {
    response.json({success_message: 'User follow being processed', remove: request.body.remove});
});

app.post('/investibles', (request, response) => {
    response.json({test_body: request.body});
});

app.patch('/investibles/asdf3', (request, response) => {
    response.json({test_body: request.body});
});

app.get('/investibles/asdf3', (request, response) => {
    response.json({id: 'asdf3'});
});

app.patch('/markets/asdf4/investibles/jfkd4', (request, response) => {
    response.json({id: 'jfkd4'});
});

app.get('/markets/asdf5/investibles/jfkd5', (request, response) => {
    response.json({id: 'jfkd5'});
});


describe('Investibles', () => {
    before(() => {
        server.listen(port);
    });

    after(() => {
        server.close();
    });
    describe('#doResolve', () => {
        it('should resolve without error', () => {
            let promise = investibles.resolve('asdf1', 'jfkd1');
            promise.then((result) => {
                //console.log(result);
                assert(result.success_message === 'Investible resolved', 'Investible should have resolved');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doFollow', () => {
        it('should follow without error', () => {
            let promise = investibles.follow('asdf2', 'jfkd2', true);
            promise.then((result) => {
                //console.log(result);
                assert(result.success_message === 'User follow being processed', 'Should have succeeded in resolve');
                assert(result.remove === true, 'Did not pass remove correctly in body')
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doCreate', () => {
        it('should create investible without error', () => {
            let promise = investibles.create('investiblesName', 'this is description', ['foo', 'bar']);
            promise.then((result) => {
                //console.log(result);
                assert(result.test_body.name === 'investiblesName', 'Did not pass the correct name in body');
                assert(result.test_body.description === 'this is description', 'Did not pass the correct description in body');
                assert(JSON.stringify(result.test_body.categoryList) === JSON.stringify(['foo', 'bar']), 'Did not pass the correct category list in body');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doUpdate', () => {
        it('should update investible without error', () => {
            let promise = investibles.update('asdf3', 'investiblesName', 'this is description', ['foo', 'bar']);
            promise.then((result) => {
                //console.log(result);
                assert(result.test_body.name === 'investiblesName', 'Did not pass the correct name in body');
                assert(result.test_body.description === 'this is description', 'Did not pass the correct description in body');
                assert(JSON.stringify(result.test_body.categoryList) === JSON.stringify(['foo', 'bar']), 'Did not pass the correct category list in body');
            }).catch((error) => {
                console.error(error);
            });
        });
    });
    describe('#doGet', () => {
        it('should get investible without error', () => {
            let promise = investibles.get('asdf3');
            promise.then((result) => {
                //console.log(result);
                assert(result.id === 'asdf3', 'Should have returned asdf3 as id')
            }).catch((error) => {
                console.error(error);
            });
        });
    });
    describe('#doUpdateMarket', () => {
        it('should update market without error', () => {
            let promise = investibles.updateMarket('asdf4','jfkd4');
            promise.then((result) => {
                //console.log(result);
                assert(result.id === 'jfkd4', 'Should have returned jfkd4 as id')
            }).catch((error) => {
                console.error(error);
            });
        });
    });
    describe('#doGetMarket', () => {
        it('should get market without error', () => {
            let promise = investibles.getMarket('asdf5','jfkd5');
            promise.then((result) => {
                //console.log(result);
                assert(result.id === 'jfkd5', 'Should have returned jfkd5 as id')
            }).catch((error) => {
                console.error(error);
            });
        });
    });


});
