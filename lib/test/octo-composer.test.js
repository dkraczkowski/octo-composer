'use strict';

var _octoComposer = require('../src/octo-composer');

var _chai = require('chai');

describe('Octo composer', () => {
    it('should compose middleware using proxy method', done => {
        let calledMethods = {};
        let fn1 = next => {
            calledMethods.fn1 = 1;
            next();
        };
        let fn2 = next => {
            calledMethods.fn2 = 2;
            next();
        };
        let middleware = (0, _octoComposer.compose)([fn1, fn2]);
        middleware();
        (0, _chai.expect)(calledMethods.fn1).to.equal(1);
        (0, _chai.expect)(calledMethods.fn2).to.equal(2);
        done();
    });
    it('should compose middleware using fluent interface', done => {
        let calledMethods = {};
        let fn1 = next => {
            calledMethods.fn1 = 1;
            next();
        };
        let fn2 = next => {
            calledMethods.fn2 = 2;
            next();
        };
        let middleware = new _octoComposer.MiddlewareComposer();
        middleware.then(fn1).then(fn2).execute();
        (0, _chai.expect)(calledMethods.fn1).to.equal(1);
        (0, _chai.expect)(calledMethods.fn2).to.equal(2);
        done();
    });

    it('should execute end method', done => {
        let calledMethods = {};
        let fn1 = next => {
            calledMethods.fn1 = 1;
            next();
        };
        let fn2 = next => {
            calledMethods.fn2 = 2;
            next();
        };
        let middleware = new _octoComposer.MiddlewareComposer();
        middleware.then(fn1).then(fn2).end(() => {
            (0, _chai.expect)(calledMethods.fn1).to.equal(1);
            (0, _chai.expect)(calledMethods.fn2).to.equal(2);
            done();
        }).execute();
    });

    it('should catch an error', done => {
        let calledMethods = {};
        let fn1 = next => {
            calledMethods.fn1 = 1;
            next();
        };
        let fn2 = next => {
            throw new Error('Error!');
            next();
        };
        let middleware = new _octoComposer.MiddlewareComposer();
        middleware.then(fn1).then(fn2).catch(e => {
            (0, _chai.expect)(calledMethods.fn1).to.equal(1);
            done();
        }).execute();
    });

    it('should compose async middleware', done => {
        let calledMethods = {};
        let fn1 = next => {
            setTimeout(() => {
                calledMethods.fn1 = 1;
                next();
            }, 10);
        };
        let fn2 = next => {
            setTimeout(() => {
                calledMethods.fn2 = 2;
                next();
            }, 5);
        };
        let middleware = new _octoComposer.MiddlewareComposer();
        middleware.then(fn1).then(fn2).end(() => {
            (0, _chai.expect)(calledMethods.fn1).to.equal(1);
            (0, _chai.expect)(calledMethods.fn2).to.equal(2);
            done();
        }).execute();
    });

    it('should pass parameters', done => {
        let calledMethods = {};
        let fn1 = (a, b, next) => {
            setTimeout(() => {
                calledMethods.fn1 = a + b;
                next();
            }, 10);
        };
        let fn2 = (a, b, next) => {
            setTimeout(() => {
                calledMethods.fn2 = a * b;
                next();
            }, 5);
        };
        let middleware = new _octoComposer.MiddlewareComposer();
        middleware.then(fn1).then(fn2).end(() => {
            (0, _chai.expect)(calledMethods.fn1).to.equal(3);
            (0, _chai.expect)(calledMethods.fn2).to.equal(2);
            done();
        }).execute(1, 2);
        (0, _octoComposer.compose)([fn1, fn2], () => {
            (0, _chai.expect)(calledMethods.fn1).to.equal(3);
            (0, _chai.expect)(calledMethods.fn2).to.equal(2);
            done();
        });
    });
});