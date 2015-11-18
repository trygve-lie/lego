/* jshint node: true, strict: true */

"use strict";

const   http            = require('http'),
        bole            = require('bole'),

        parameters      = require('./parameters.js'),
        config          = require('./config.js'),
        errors          = require('express-error-responses/lib/middleware.js'),
        routes          = require('./routes.js'),

        express         = require('express'),
        compress        = require('compression')(),
        serveStatic     = require('serve-static'),

        Component       = require('../lib/main.js'),

        app             = express(),
        log             = bole('app');



// Configure logging

bole.output({
    level: config.get('logConsoleLevel'),
    stream: process.stdout
});



// Set up component that this server serves

const component = new Component();



// Configure application

app.disable('x-powered-by');
app.enable('trust proxy');
app.use(compress);



// Validate URL parameters

app.param('publication', parameters.publication);



// Serve server specific static files

app.use(config.get('publicPath') + '/:publication', serveStatic(config.get('docRoot')));



// Set up server specific routes

app.get(config.get('contextPath') + '/apiadmin/ping', routes.ping);



// Attach the component router

app.use(config.get('publicPath') + '/:publication', component.router);



// Error handling

app.use(errors.response);
app.use(errors.status404);



// Set up and export http server

const httpServer = module.exports = http.createServer(app);
