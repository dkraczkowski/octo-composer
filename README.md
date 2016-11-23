# Octo-composer [![Build Status](https://travis-ci.org/dkraczkowski/octo-composer.svg?branch=master)](https://travis-ci.org/dkraczkowski/octo-composer)
octo-composer is a minimalistic stand-alone middleware composing library for node.js.

# Installation
npm install octo-composer

# Usage

###Simple example

```js
var compose = require('octo-composer').compose;

var middleware = compose([
  function (next) { console.log('Hello'); next(); },
  function (next) { console.log('World'); next(); }
]);

middleware();// Will print: HelloWorld
```

###Handling errors
```js
var MiddlewareComposer = require('octo-composer').MiddlewareComposer;

var middleware = new MiddlewareComposer();
middleware.then(function(next) {console.log('Hello'); next()})
    .then(function(next) {throw new Error('Error!'); next();})
    .catch(function (err) {console.log(err.message);});

middleware.execute();// Will print: HelloError!
```

###Handling completion
```js
var MiddlewareComposer = require('octo-composer').MiddlewareComposer;

var middleware = new MiddlewareComposer();
middleware.then(function(next) {console.log('Hello'); next();})
    .then(function(next) {console.log('World'); next();})
    .end(function () {console.log('!');});

middleware.execute();// Will print: HelloWorld!
```

###Passing parameters to middlewares
```js
var MiddlewareComposer = require('octo-composer').MiddlewareComposer;

var middleware = new MiddlewareComposer();
middleware.then(function(a, b, next) {console.log(a + b); next();})
    .then(function(a, b, next) {console.log(a * b); next();});

middleware.execute(1, 2);// Will print: 32
```

# API

## `new MiddlewareComposer()`
Creates new middleware composer instance

## `MiddlewareComposer.then(middleware)`
Adds middleware function to the composer.

## `MiddlewareComposer.end`
Sets completion handler. The handler will be executed only if all middlewares were successfully run.

## `MiddlewareComposer.catch(handler)`
Sets error handler. If any of middlewares throw an error MiddlewareComposer will stop executing the rest of middlewares 
and will call error handler instead.

## `MiddlewareComposer.execute(..args)`
Executes all middlewares in the order they were added to the composer. All middlewares will receive `next` function
as an additional parameter to the one that are passed to this method. 

`next` function must be called in each of middlewares in order this to work.

## `compose(middlewares, onEnd, onError)`
Returns function which can be used to execute composed middleware handler.
