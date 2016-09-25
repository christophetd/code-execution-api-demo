"use strict";

let log     = require('winston');
let config  = require('../config');

const notAllowedResponse = {
    error: "The IP :ip: is not allowed to call the API",
    status: 403
};

module.exports = (request, response, next) => {
    log.debug('[IP Whitelist Middleware]');
    
    let allowedIps = config.security.allowedIps;
    if (!allowedIps || !allowedIps.length) {
        return next();
    }
    
    let ip = request.connection.remoteAddress;
    
    if (!ip || allowedIps.indexOf(ip) < 0) {
        notAllowedResponse.error = notAllowedResponse.error.replace(':ip:', ip);
        
        return response
            .status(403)
            .json(notAllowedResponse)
            .end();
    }
    
    next();
};