const { CACHE_TIME } = require('./config');

const cache = {};

const cacheMiddleware = (req, res, next) => {
    console.log('Hellurei');
    const path = req.path;
    const cached = cache[path];
    const now = Date.now();
    if (cached && now - cached.time < CACHE_TIME) {
        // Return cached resource
        res = cached.res;
        return;
    }
    // Cache resource
    next();
    cache[path] = {
        'res': res,
        'time': now
    }
}

module.exports = cacheMiddleware;
