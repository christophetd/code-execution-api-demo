"use strict";

let log     = require('winston');
let config  = require('../config');

const notAllowedResponse = {
    error: "No API key or incorrect value provided",
    status: 403
};

module.exports = (request, response, next) => {
    log.debug('[Security Key Middleware]');
    
    const secret = config.security.secret;
    if (!secret || !secret.length) {
        return next();
    }
    
    const headerName = config.security.secret_header.toLowerCase();
    const headerValue = request.headers[headerName];
    
    if (!headerValue || headerValue !== secret) {
        return response
            .status(403)
            .json(notAllowedResponse)
            .end();
    }
    
    next();
};