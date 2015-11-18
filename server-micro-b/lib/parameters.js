/* jshint node: true, strict: true */

"use strict";

var validators  = require('./validators.js'),
    errors      = require('express-error-responses/lib/error.js');



/** 
  * Validate the "tag" parameter
  *
  * @param {Object} req HTTP request object
  * @param {Object} res HTTP response object
  * @param {function} next Next function in the route
  * @param {String} param Parameter from the URL
  */

module.exports.tag = function (req, res, next, param) {
    validators.tagStr.validate(param, function (error, value) {
        if (error) {
            return next(errors.validationError(error));
        } 

        req.params.tag = value;
        next();
    });
};
