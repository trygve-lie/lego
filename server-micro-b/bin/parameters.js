/* jshint node: true, strict: true */

"use strict";

const   validators  = require('./validators.js'),
        errors      = require('express-error-responses/lib/error.js'),
        bole        = require('bole'),
        log         = bole('parameters');



/** 
  * Validate the "publication" parameter 
  *
  * @param {Object} req HTTP request object
  * @param {Object} res HTTP response object
  * @param {function} next Next function in the route
  * @param {String} param Parameter from the URL
  */

module.exports.publication = function (req, res, next, param) {
    validators.publication.validate(param, function (error, value) {
        if (error) {
            log.error(error, 'request has illegal value for parameter "publication" - ' + param);
            return next(errors.validationError(error));
        }
        
        req.params.publication = value;
        return next();
    });
};
