import assert from 'assert';
import {serverCreator, clientCreator} from './testSetup';

const {app, server} = serverCreator();


app.post('/create', (request, response) => {
    response.json({test_body: request.body});
});

app.post('/asdf3/comment', (request, response) => {
    response.json({test_body: request.body});
});

app.patch('/asdf3', (request, response) => {
    response.json({test_body: request.body});
});

app.post('/foo/bind/bar', (request, response) => {
    response.json({test_body: request.body})
});

app.patch('/comment/Casdf3', (request, response) => {
    response.json({test_body: request.body});
});

app.get('/asdf4', (request, response) => {
    response.json({id: 'asdf4'});
});

app.patch('/follow/steak', (request, response) => {
    response.json({test_body: request.body});
});

app.patch('/roi/steak', (request, response) => {
    response.json({resolution_id: 'asdf5'});
});

app.post('/category/myMarketId', (request, response) => {
    response.json({test_body: request.body});
});

app.patch('/state/steak', (request, response) => {
    response.json({success_message: 'Investible state updated'});
});

app.get('/list', (request, response) => {
    response.json({investibleTemplates: 'fiction'});
});

app.get('/comments/asdf3', (request, response) => {
    response.json({comments: 'some comments'});
});

app.patch('/meat', (request, response) => {
    response.json({success_message: 'updated', test_body: request.body});
});

app.get('/comment/snark', (request, response) => {
    response.json({comment: 'snarky comment'})
});

app.delete('/market/steak/category/steak%20sauce', (request, response) => {
    response.json({success_message: 'Category deleted'});
});

import {Investibles} from '../../src/components/investibles.js';


let investibles = null;

describe('Investibles', () => {
    before(() => {
        const client = clientCreator(server);
        investibles = new Investibles(client);
    });

    after(() => {
        server.close()
    });

    describe('#doCreate', () => {
        it('should create investible without error', () => {
            assert(server.listening);
            let promise = investibles.create('investiblesName', 'this is description');
            promise.then((result) => {
                assert(result.test_body.name === 'investiblesName', 'Did not pass the correct name in body');
                assert(result.test_body.description === 'this is description', 'Did not pass the correct description in body');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doCreateComment', () => {
        it('should create comment without error', () => {
            assert(server.listening);
            let promise = investibles.createComment('asdf3', 'comment body');
            promise.then((result) => {
                assert(result.test_body.body === 'comment body', 'Did not pass the correct body');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doUpdateComment', () => {
        it('should update comment without error', () => {
            assert(server.listening);
            let promise = investibles.updateComment('Casdf3', 'comment body');
            promise.then((result) => {
                assert(result.test_body.body === 'comment body', 'Did not pass the correct body');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doCreateCategory', () => {
        it('should create category without error', () => {
            assert(server.listening);
            let promise = investibles.createCategory('my category name', 'myMarketId');
            promise.then((result) => {
                assert(result.test_body.name === 'my category name', 'Did not pass the correct name in body');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doDeleteCategory', () => {
        it('should delete category without error', () => {
            assert(server.listening);
            let promise = investibles.deleteCategory('steak sauce', 'steak');
            promise.then((result) => {
                assert(result.success_message === 'Category deleted', 'Did not delete category');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doUpdate', () => {
        it('should update investible without error', () => {
            let promise = investibles.update('asdf3', 'investiblesName', 'this is description', ['foo', 'bar']);
            return promise.then((result) => {
                //console.log(result);
                assert(result.test_body.name === 'investiblesName', 'Did not pass the correct name in body');
                assert(result.test_body.description === 'this is description', 'Did not pass the correct description in body');
                assert(JSON.stringify(result.test_body.category_list) === JSON.stringify(['foo', 'bar']), 'Did not pass the correct category list in body');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doBindInvestible', () => {
        it('should bind investible without error', () => {
            let promise = investibles.bindToMarket('foo', 'bar', ['cat1', 'cat2']);
            return promise.then((result) => {
                assert(JSON.stringify(result.test_body.category_list) === JSON.stringify(['cat1', 'cat2']), 'Did not pass the correct category list in body');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doUnfollowInvestible', () => {
        it('should follow the investible without error', () => {
            let promise = investibles.follow('steak', true);
            promise.then((result) => {
                assert(result.test_body.remove, 'Should have put the remove request in the body');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doInitiateRoi', () => {
        it('should initiate ROI for the investible without error', () => {
            let promise = investibles.initiateRoi('steak');
            promise.then((result) => {
                assert(result.resolution_id === 'asdf5', 'Should have returned asdf5 as id');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doStateChange', () => {
        it('should change investible state without error', () => {
            let promise = investibles.stateChange('steak', {option1: 'option1', option2: 'option2'});
            promise.then((result) => {
                assert(result.success_message === 'Investible state updated', 'Should return the proper success message');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doGet', () => {
        it('should get investible without error', async () => {
            let promise = investibles.get('asdf4');
            await promise.then((result) => {
                //console.log(result);
                assert(result.id === 'asdf4', 'Should have returned asdf4 as id')
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doListInvestibleTemplates', () => {
        it('should get  the investible without error', () => {
            let promise = investibles.listTemplates();
            promise.then((result) => {
                assert(result.investibleTemplates === 'fiction', 'Should have returned proper investible templates');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doListComments', () => {
        it('should get the comments without error', () => {
            let promise = investibles.listComments('asdf3');
            promise.then((result) => {
                assert(result.comments === 'some comments', 'Should have returned proper investible comments');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doGetComment', () => {
        it('should get the comment without error', () => {
            let promise = investibles.getComment('snark');
            promise.then((result) => {
                assert(result.comment === 'snarky comment', 'Should have returned proper comment');
            }).catch((error) => {
                console.error(error);
            });
        });
    });

    describe('#doUpdateMarketInvestible', () => {
        it('should update the investible without error', () => {
            let promise = investibles.updateInMarket('meat', 'pork', 'foo', 'mydesc', ['a']);
            promise.then((result) => {
                assert(result.success_message === 'updated', 'Should have returned the proper success message');
                assert(result.test_body.name === 'foo', 'Should have put the name in the body');
                assert(result.test_body.market_id === 'pork', 'Should have put market id in the body');
                assert(result.test_body.category_list[0] === 'a', 'Should have put the category in the body');
            });
        });
    });

});
