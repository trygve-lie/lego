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
app.use(compress);



// Validate URL parameters

app.param('publication', parameters.publication);



// Serve server specific static files

app.use(config.get('publicPath') + '/:publication', serveStatic(config.get('docRoot')));



// Set up server specific routes

app.get(config.get('contextPath') + '/apiadmin/ping', routes.ping);
app.get(config.get('publicPath') + '/assets/microa/main.js', routes.assetsA);
app.get(config.get('publicPath') + '/assets/microb/main.js', routes.assetsB);
app.get(config.get('publicPath') + '/assets/bundle/main.js', routes.assetsAB);



// Error handling

app.use(errors.response);
app.use(errors.status404);



// Set up and export http server

const httpServer = module.exports = http.createServer(app);
