"use strict";

let log = require('winston');

module.exports = (request, response, next) => {
    log.debug('[Rate Limiter Middleware]');
    next();
}