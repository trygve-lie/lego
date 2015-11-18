/* jshint node: true, strict: true */

"use strict";

const   url             = require('url'),
        http            = require('http'),
        bole            = require('bole'),

        config          = require('./config.js'),
//        errors          = require('./errors.js'),
//        routes          = require('./routes.js'),

        express         = require('express'),
        compress        = require('compression')(),
        serveStatic     = require('serve-static'),

        app             = express(),
        log             = bole('app');



// Configure logging

bole.output({
    level: config.get('logConsoleLevel'),
    stream: process.stdout
});



// Configure application

app.disable('x-powered-by');
app.enable('trust proxy');



// Set middleware

app.use(compress);
app.use(serveStatic(config.get('docRoot')));



// Set up routes

// app.get('/admin/ping', routes.ping);



// Attach routers 

// app.use('/', api.routes);



// Error handling

// app.use(errors.response);
// app.use(errors.status404);



// Set up http server

const httpServer = http.createServer(app);



// Export application

module.exports = httpServer;
