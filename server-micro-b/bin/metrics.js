/* jshint node: true, strict: true */

"use strict";

const   Numbat  = require('numbat-emitter'),
        config  = require('./config.js'),
        bole    = require('bole'),
        net     = require('net'),
        log     = bole('metrics');



const numbat = module.exports = new Numbat({
    uri: config.get('metricsServerUri'),
    app: config.get('name'),
    maxretries: 20,
    maxbacklog: 40
});


numbat.on('failed', function () {
    log.info('failed connecting to metrics server - backlog: ' + numbat.backlog.length);
});


numbat.on('close', function () { 
    log.info('closed connection to metrics server - retries: ' + numbat.retries + ' - backlog: ' + numbat.backlog.length);
});


numbat.on('ready', function () { 
    log.info('opened connection to metrics server');
});
