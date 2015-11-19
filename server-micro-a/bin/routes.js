/* jshint node: true, strict: true */

"use strict";


const   bole        = require('bole'),
        log         = bole('routes');



/** 
  * Route ping responses
  *
  * @param {Object} req HTTP request object
  * @param {Object} res HTTP response object
  * @param {function} next Next function in the route
  */

module.exports.ping = function (req, res, next) {
    res.status(200).send('OK');
};
