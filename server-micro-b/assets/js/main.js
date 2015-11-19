/* jshint node: true, strict: true */

"use strict";

var foo = require('./foo.js'),
    bar = require('./bar.js'),
    EE  = require('eventemitter3');

console.log('server-micro-b:', foo.helloworld());
console.log('server-micro-b:', bar.world() + ' ' + foo.hello());