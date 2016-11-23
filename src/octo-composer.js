export class MiddlewareComposer {

    constructor() {
        this._cursor = 0;
        this._then = [];
        this._catch = null;
        this._args = null;
        this._values = [];
    }

    then(fn) {
        this._then.push(fn);
        return this;
    }

    catch(fn) {
        this._catch = fn;
        return this;
    }

    end(fn) {
        this._end = fn;
        return this;
    }

    execute(...args) {
        var self = this;
        this._args = args;

        (function _next() {
            if (self._cursor >= self._then.length) {
                if (typeof self._end === 'function') {
                    self._end(self._values);
                }
                return;
            }
            try {
                self._values.push(self._then[self._cursor].apply(self._then[self._cursor], self._args.concat([function next() {
                    self._cursor++;
                    _next();
                }])));
            } catch (e) {
                self._cursor = self._then.length;
                if (self._catch) {
                    return self._catch(e);
                }
                throw e;
            }
        })();
        return this;
    }
}

export function wrap(instance) {
    return (...args) => {
        instance.execute.apply(instance, args);
    }
}

export function compose(middlewares, completeHandler, errorHandler) {
    var instance = new MiddlewareComposer();
    for (let fn of middlewares) {
        instance.then(fn);
    }
    instance.end(completeHandler);
    instance.catch(errorHandler);
    return wrap(instance);
}
