/* jshint node: true, strict: true */

"use strict";


const   request     = require('request'),
        JSONStream  = require('JSONStream'),
        pack        = require('browser-pack'),
        mergeStream = require('merge-stream'),
        depsSort    = require('deps-sort'),
        bole        = require('bole'),
        log         = bole('routes');


/** 
  * Route ping responses
  *
  * @param {Object} req HTTP request object
  * @param {Object} res HTTP response object
  * @param {function} next Next function in the route
  */

module.exports.ping = function(req, res, next) {
    res.status(200).send('OK');
};



module.exports.assetsA = function (req, res, next) {
    var uri = 'http://localhost:7100/public/assets/main.json',
        packer = pack();

    res.writeHead(200, {'Content-Type' : 'application/javascript'});
    request.get(uri).pipe(packer).pipe(res);
};



module.exports.assetsB = function (req, res, next) {
    var uri = 'http://localhost:7200/public/assets/main.json',
        packer = pack();

    res.writeHead(200, {'Content-Type' : 'application/javascript'});
    request.get(uri).pipe(packer).pipe(res);
};



module.exports.assetsAB = function (req, res, next) {
    var srcA = request.get('http://localhost:7100/public/assets/main.json').pipe(JSONStream.parse('*')),
        srcB = request.get('http://localhost:7200/public/assets/main.json').pipe(JSONStream.parse('*'));

    var packer = pack();

    var merged = mergeStream();
    merged.add(srcA);
    merged.add(srcB);

    var sort = depsSort({dedupe: true});

    res.writeHead(200, {'Content-Type' : 'application/javascript'});
    merged.pipe(sort).pipe(JSONStream.stringify()).pipe(packer).pipe(res);
    // merged.pipe(sort).pipe(JSONStream.stringify()).pipe(res);
};
