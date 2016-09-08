module.exports = {
    ipWhiteList:    require('./ipWhiteListMiddleware'), 
    securityKey:    require('./securityKeyMiddleware'), 
    rateLimiter:    require('./rateLimiterMiddleware'), 
    logger:         require('./loggerMiddleware')
};