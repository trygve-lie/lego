/* jshint node: true, strict: true */


"use strict";

const   Router  = require('./router.js');



var Service = module.exports = function (db, config) {
    var router = new Router(config);
    this.router = router.router;
};
