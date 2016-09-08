"use strict";

let log = require('winston');

module.exports = (request, response, next) => {
    if (request.url == '/favicon.ico') {
        response.writeHead(200, {'Content-Type': 'image/x-icon'} );
        return response.end();
    }
    next();
};