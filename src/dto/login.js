const response = (success, response = null, error = null) => {
    return {
        success,
        response,
        error
    };
};

module.exports = response;
