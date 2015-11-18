/* jshint node: true, strict: true */

"use strict";

var path    = require('path'),
    fs      = require('fs'),
    convict = require('convict'),
    pckage  = require('../package.json');

// Configuration schema

var conf = convict({
env: {

    doc: "Applicaton environments",
        format  : ["development", "production"],
        default : "development",
        env     : "NODE_ENV",
        arg     : "env"
    },

    version: {
        doc     : "Version of the application",
        format  : "*",
        default : pckage.version
    },

    serverPort: {
        doc     : "The port the server should bind to",
        format  : "port",
        default : 7900,
        env     : "PORT",
        arg     : "port"
    }

});



// Load and validate configuration depending on environment

var env = conf.get('env');

if (fs.existsSync(path.resolve(__dirname, '../config/local.json'))) {
    conf.loadFile([path.resolve(__dirname, '../config/', env + '.json'), path.resolve(__dirname, '../config/local.json')]);
} else {
    conf.loadFile([path.resolve(__dirname, '../config/', env + '.json')]);
}

conf.validate();



// Export merged configuration to the application

module.exports = conf;
