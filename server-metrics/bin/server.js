/* jshint node: true, strict: true */

"use strict";

const   bole    = require('bole'),
        Numbat  = require('numbat-collector'),
        config  = require('./config.js'),
        log     = bole('server');



// Configure logging

bole.output({
    level: 'info',
    stream: process.stdout
});



// Configure Numbat for collecting metrics

const server = new Numbat({
    logging:
    {
        silent: false
    },
    listen: { 
        host: 'localhost', 
        port: config.get('serverPort')
    },
    outputs: 
    [
        { type: 'prettylog', name: 'collector' },
    ]
});



// Start application

server.listen(function () {
    log.info('server process has pid ' + process.pid);
    log.info('environment is: ' + config.get('env'));
});



// Catch uncaught exceptions, log it and take down server in a nice way.
// Upstart or forever should handle kicking the process back into life!

process.on('uncaughtException', function (error) {
    log.error(error, 'shutdown - server taken down by force due to a uncaughtException');
    server.destroy(function () {
        process.exit(1);
    });
});



// Listen for SIGINT (Ctrl+C) and do a gracefull takedown of the server

process.on('SIGINT', function () {
    log.info('shutdown - got SIGINT - taking down server gracefully');
    server.destroy(function () {
        process.exit(0);
    });
});



// Listen for SIGTERM (Upstart) and do a gracefull takedown of the server

process.on('SIGTERM', function () {
    log.info('shutdown - got SIGTERM - taking down server gracefully');
    server.destroy(function () {
        process.exit(0);
    });
});
