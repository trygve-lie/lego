/* jshint node: true, strict: true */

"use strict";

const   Joi = require('joi');



/**
  * Validator for a "tag" String
  *
  * ACP operate with the following rules for converting "tags":
  * they get from ECE:
  * - tags are lowercase
  * - ae is replaced with a. ae is probably output for æ from ECE
  * - ? is replaced with o. ? is probably output for ø and å from ECE
  * - all non a-z and 0-9 characters is replaced with _
  *
  * Regex: http://regexper.com/#%2F%5E%5BA-Za-z0-9%C3%A6%C3%B8%C3%A5%C3%86%C3%98%C3%85_-%5D%2B%24%2F
  */

module.exports.tagStr = Joi.string().regex(/^[A-Za-z0-9æøåÆØÅ_-]+$/).min(2).max(60).lowercase().trim().required();



/**
  * Validator for a "tag" Object
  */

module.exports.tagObj = Joi.object().keys({
    tag: this.tagStr
});
