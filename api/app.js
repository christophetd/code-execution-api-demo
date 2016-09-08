"use strict";

var Sandbox     = require('docker-python-sandbox');
var log         = require('winston');
let fs          = require('fs');
let express     = require('express');
let bodyParser  = require('body-parser');
let config      = require('./config');
let middlewares = require('./middlewares');
let handler     = require('./handler');

log.level = config.log.level || 'debug';

let app = express();
let sandbox = new Sandbox(config.sandbox);

if (config.debug.serveSampleUi === true) {
  app.use(express.static(__dirname + '/../www'));
}

app.use(bodyParser.json());
app.use(middlewares.logger);
app.use(middlewares.ipWhiteList);
app.use(middlewares.securityKey);
app.use(middlewares.rateLimiter);

app.post(config.api.endpoint, handler(sandbox));

log.info("Initializing Sandbox")

sandbox.createPool( (err) => {
  if (err) {
    log.error("Failed to start docker pool");
    log.error(err);
    return
  }
  
  log.info("Sandbox initialized");
  
  app.listen(config.api.port, () => {
    log.info(`API Listening on port ${config.api.port}`);
  });
})