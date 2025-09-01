const { CACHE_TIME } = require('./config');

const cache = {};

const cacheMiddleware = (req, res, next) => {
    const path = req.path;
    const cached = cache[path];
    const now = Date.now();
    if (cached && now - cached.time < CACHE_TIME) {
        // Return cached resource
        res = cached.res;
        return;
    }
    next();
    
    // Don't cache resources which are not found
    if (res.outputSize == 0) {
        return;
    }

    // Cache resource
    cache[path] = {
        'res': res,
        'time': now
    }
}

module.exports = cacheMiddleware;
