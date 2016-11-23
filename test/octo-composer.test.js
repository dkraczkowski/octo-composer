import { MiddlewareComposer, compose } from '../src/octo-composer';
import { expect } from 'chai';

describe('Octo composer', () => {
    it('should compose middleware using proxy method', (done) => {
        let calledMethods = {};
        let fn1 = (next) => {
            calledMethods.fn1 = 1;
            next();
        };
        let fn2 = (next) => {
            calledMethods.fn2 = 2;
            next();
        };
        let middleware = compose([fn1, fn2]);
        middleware();
        expect(calledMethods.fn1).to.equal(1);
        expect(calledMethods.fn2).to.equal(2);
        done();
    });
    it('should compose middleware using fluent interface', (done) => {
        let calledMethods = {};
        let fn1 = (next) => {
            calledMethods.fn1 = 1;
            next();
        };
        let fn2 = (next) => {
            calledMethods.fn2 = 2;
            next();
        };
        let middleware = new MiddlewareComposer();
        middleware.then(fn1).then(fn2).execute();
        expect(calledMethods.fn1).to.equal(1);
        expect(calledMethods.fn2).to.equal(2);
        done();
    });

    it('should execute end method', (done) => {
        let calledMethods = {};
        let fn1 = (next) => {
            calledMethods.fn1 = 1;
            next();
        };
        let fn2 = (next) => {
            calledMethods.fn2 = 2;
            next();
        };
        let middleware = new MiddlewareComposer();
        middleware.then(fn1).then(fn2).end(() => {
            expect(calledMethods.fn1).to.equal(1);
            expect(calledMethods.fn2).to.equal(2);
            done();
        }).execute();

    });

    it('should catch an error', (done) => {
        let calledMethods = {};
        let fn1 = (next) => {
            calledMethods.fn1 = 1;
            next();
        };
        let fn2 = (next) => {
            throw new Error('Error!');
            next();
        };
        let middleware = new MiddlewareComposer();
        middleware.then(fn1).then(fn2).catch((e) => {
            expect(calledMethods.fn1).to.equal(1);
            done();
        }).execute();

    });

    it('should compose async middleware', (done) => {
        let calledMethods = {};
        let fn1 = (next) => {
            setTimeout(() => {
                calledMethods.fn1 = 1;
                next();
            }, 10);
        };
        let fn2 = (next) => {
            setTimeout(() => {
                calledMethods.fn2 = 2;
                next();
            }, 5);
        };
        let middleware = new MiddlewareComposer();
        middleware.then(fn1).then(fn2).end(() => {
            expect(calledMethods.fn1).to.equal(1);
            expect(calledMethods.fn2).to.equal(2);
            done();
        }).execute();
    });

    it('should pass parameters', (done) => {
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
        let middleware = new MiddlewareComposer();
        middleware.then(fn1).then(fn2).end(() => {
            expect(calledMethods.fn1).to.equal(3);
            expect(calledMethods.fn2).to.equal(2);
            done();
        }).execute(1, 2);
        compose([fn1, fn2], () => {
            expect(calledMethods.fn1).to.equal(3);
            expect(calledMethods.fn2).to.equal(2);
            done();
        });

    });
});
