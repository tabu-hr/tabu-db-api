const logger = {
    error: (...args) => console.error(...args),
    warn: (...args) => console.warn(...args),
    info: (...args) => console.log(...args),
    debug: (...args) => process.env.NODE_ENV === 'development' && console.log(...args)
};

module.exports = logger;
