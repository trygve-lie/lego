/* jshint node: true, strict: true */

"use strict";

const   fs      = require('fs'),
        net     = require('net'),
        repl    = require('repl'),
        config  = require('./config.js'),
        server  = require('./app.js'),
        metrics = require('./metrics.js'),
        bole    = require('bole'),
        log     = bole('server');


// Start application

server.listen(config.get('httpServerPort'), function () {
    log.info('server running at http://localhost:' + server.address().port);
    log.info('server process has pid ' + process.pid);
    log.info('serving documents from ' + config.get('docRoot'));
    log.info('environment is: ' + config.get('env'));
});



// Expose a REPL

var replPath = './repl.' + config.get('httpServerPort') + '.sock';

var netRepl = net.createServer(function (socket) {
    log.info('user connected to the REPL');
    var replServer = repl.start({
        prompt: config.get('name') + '> ',
        input: socket,
        output: socket,
        terminal: true,
        useGlobal: false
    }).on('exit', function () {
        log.info('user exited the REPL');
        socket.end();
    }).on('error', function (err) {
        log.error(err, 'repl error');
    });

    replServer.context.server = server;
    replServer.context.config = config;
});

fs.unlink(replPath, function () {
    netRepl.listen(replPath, function () {
        log.info('repl available at ' + replPath);
    });
});



// Catch uncaught exceptions, log it and take down server in a nice way.
// Upstart or forever should handle kicking the process back into life!

process.on('uncaughtException', function (err) {
    log.error(err, 'shutdown - server taken down by force due to a uncaughtException');
    netRepl.close();
    server.close();
    metrics.metric({ name: 'server.uncaughtException', pid: process.pid });
    process.nextTick(function () {
        process.exit(1);
    });
});



// Listen for SIGINT (Ctrl+C) and do a gracefull takedown of the server

process.on('SIGINT', function () {
    log.info('shutdown - got SIGINT - taking down server gracefully');
    netRepl.close();
    server.close();
    process.nextTick(function () {
        process.exit(0);
    });
});



// Listen for SIGTERM (Upstart) and do a gracefull takedown of the server

process.on('SIGTERM', function () {
    log.info('shutdown - got SIGTERM - taking down server gracefully');
    netRepl.close();
    server.close();
    process.nextTick(function () {
        process.exit(0);
    });
});
