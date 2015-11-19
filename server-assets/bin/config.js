/* jshint node: true, strict: true */

"use strict";

const   path    = require('path'),
        fs      = require('fs'),
        convict = require('convict'),
        pckage  = require('../package.json');


// Configuration schema

var conf = module.exports = convict({
env: {

    doc: "Applicaton environments",
        format  : ["development", "production"],
        default : "development",
        env     : "NODE_ENV"
    },

    version: {
        doc     : "Version of the application",
        format  : String,
        default : pckage.version
    },

    name: {
        doc     : "Name of the application",
        format  : String,
        default : pckage.name
    },

    httpServerPort: {
        doc     : "The port the server should bind to",
        format  : "port",
        default : 7400,
        env     : "PORT",
        arg     : "port"
    },

    contextPath: {
        doc     : "The prefix for all routes intended to only be accessed by other servers",
        format  : String,
        default : "/" + pckage.name
    },

    publicPath: {
        doc     : "The route the application is served on. This is the route the end user access in the browser",
        format  : String,
        default : "/public"
    },

    docRoot: {
        doc     : "Document root for static files to be served by the http server",
        format  : String,
        default : "./public"
    },

    logConsoleLevel: {
        doc     : "Which level the console transport log should log at",
        format  : String,
        default : "debug"
    },

    metricsServerUri: {
        doc     : "URI to metrics collector",
        format  : String,
        default : "tcp://localhost:7900"
    }

});



// Load and validate configuration depending on environment

if (fs.existsSync(path.resolve(__dirname, '../config/local.json'))) {
    conf.loadFile([path.resolve(__dirname, '../config/', conf.get('env') + '.json'), path.resolve(__dirname, '../config/local.json')]);
} else {
    conf.loadFile([path.resolve(__dirname, '../config/', conf.get('env') + '.json')]);
}

conf.validate();
