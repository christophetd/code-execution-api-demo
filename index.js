"use strict";

var Sandbox = require('docker-python-sandbox');
var log = require('winston');
let fs = require('fs')
let express = require('express')
let bodyParser = require('body-parser')

log.level = 'debug';

let app = express()

app.use(express.static(__dirname + '/www'));

app.use(bodyParser.json())

app.post('/compile', function (req, res) {
  if (!req.body.code) {
    return res.status(400).end();
  }
  sandbox.run(req.body.code, function (err, result) {
    if (err) return res.status(500).end();
    
    res.status(200)
    
    res.setHeader('Content-Type', 'application/json')
    
    res.end(JSON.stringify(result));
  })
})

let sandbox = new Sandbox({poolSize: 3, enableNetwork: true})
log.info("Initializing pool...")
sandbox.createPool((err) => {
  if (err) {
    log.error("Failed to start docker pool "+err)
    return
  }
  
  log.info("Pool initialized")
  
  app.listen(3000, function () {
    log.info("Listening on port 3000");
  });
})