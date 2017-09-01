const ERRORS = {
  noCode: {
    status: 400, 
    error: "No code provided"
  }, 
  internal: {
    status: 500, 
    error: "An internal error has occurred"
  }
};

module.exports = (sandbox) => (request, response) => {
  
  if (!request.body.code) {
    return response
      .status(ERRORS.noCode.status)
      .json(ERRORS.noCode)
      .end();
  }

  options = {
    code: request.body.code, 
    v3: (request.body.v3 == true || request.body.v3 == "true")
  }

  sandbox.run(options, function (err, result) {
      
    if (err) {
      return response
        .status(ERRORS.internal.status)
        .json(ERRORS.internal)
        .end();
    }
    
    response
      .status(200)
      .json(result)
      .end();
  })
};