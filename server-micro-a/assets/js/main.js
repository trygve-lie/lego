/* jshint node: true, strict: true */

"use strict";

var foo = require('./foo.js'),
    bar = require('./bar.js'),
    EE  = require('eventemitter3');

console.log('server-micro-a:', foo.helloworld());
console.log('server-micro-a:', bar.world() + ' ' + foo.hello());