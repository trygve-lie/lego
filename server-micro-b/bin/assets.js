/* jshint node: true, strict: true */

"use strict";


const   path        = require('path'),
        through     = require('through2'),
        shasum      = require('shasum'),
        mdeps       = require('module-deps'),
        JSONStream  = require('JSONStream'),
        pack        = require('browser-pack'),
        bole        = require('bole'),
        log         = bole('assets');



/** 
  * Route for bundling common js modules into a js bundle
  *
  * @param {Object} req HTTP request object
  * @param {Object} res HTTP response object
  * @param {function} next Next function in the route
  */

module.exports.js = function (req, res, next) {
    var md = mdeps(),
        packer = pack();

    res.writeHead(200, {'Content-Type' : 'application/javascript'});
    md.pipe(JSONStream.stringify()).pipe(packer).pipe(res);
    md.end({file: path.resolve(__dirname, '../assets/js/main.js')});
};



/** 
  * Route for bundling common js modules into a json array
  *
  * @param {Object} req HTTP request object
  * @param {Object} res HTTP response object
  * @param {function} next Next function in the route
  */

module.exports.json = function (req, res, next) {
    var md = mdeps(),
        dictionary = {};

    var hasher = through.obj(function (row, enc, nxt) {
        dictionary[row.id] = shasum(row.source);
        this.push(row);
        nxt();
    });

    var labeler = through.obj(function (row, enc, nxt) {
        row.id = dictionary[row.id];
        Object.keys(row.deps).forEach(function (key) {
            row.deps[key] = dictionary[row.deps[key]];
        });
        this.push(row);
        nxt();
    });

    res.writeHead(200, {'Content-Type' : 'application/json'});

    md.pipe(hasher).pipe(labeler).pipe(JSONStream.stringify()).pipe(res);
    md.end({file: path.resolve(__dirname, '../assets/js/main.js')});
};
