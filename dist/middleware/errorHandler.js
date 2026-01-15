"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.ErrorResponse = void 0;
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.ErrorResponse = ErrorResponse;
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    console.error(err);
    // Mongoose Bad ObjectId
    if (err.name === "CastError") {
        const message = "Resource not found";
        error = { message, statusCode: 404 };
    }
    // Mongoose Duplicate Key
    if (err.code === 11000) {
        const message = "Duplicate field value entered";
        error = { message, statusCode: 400 };
    }
    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
        error = { message, statusCode: 400 };
    }
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Server Error",
    });
};
exports.errorHandler = errorHandler;
