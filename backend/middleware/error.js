const ErrorHandler = require('../utils/ErrorHandler');

module.exports = (err, req, res, next) => {
    // Default error status and message
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Wrong MongoDB ID error
    if (err.name === "CastError") {
        const message = `Resource not found with this id... Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate key ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }

    // Wrong JWT error 
    if (err.name === "JsonWebTokenError") {
        const message = `Your token is invalid. Please try again later.`;
        err = new ErrorHandler(message, 401); // 401 is typically used for invalid tokens
    }

    // JWT expired error
    if (err.name === 'TokenExpiredError') {
        const message = `Your token has expired. Please log in again.`;
        err = new ErrorHandler(message, 401); // 401 is typically used for expired tokens
    }

    // Send response
    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};
