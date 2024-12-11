class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        // Capturing the stack trace for debugging purposes
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorHandler;
