export class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequestError extends CustomError {
    constructor(message = 'Bad Request') {
        super(message, 400);
    }
}

export class Unauthorized extends CustomError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

export class ForbiddenError extends CustomError {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}

export class NotFoundError extends CustomError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}

export class ConflictError extends CustomError {
    constructor(message = 'Conflict') {
        super(message, 409);
    }
}

export class InternalServerError extends CustomError {
    constructor(message = 'Internal Server Error') {
        super(message, 500);
    }
}

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Something went wrong';

    if (err instanceof CustomError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    if (process.env.NODE_ENV === 'development') {
        console.error({
            error: err.name,
            message: err.message,
            stack: err.stack,
            statusCode
        });
    }

    res.status(statusCode).json({
        success: false,
        error: {
            status: statusCode,
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const validationErrorHandler = (errors) => {
    const errorMessages = errors.array().map(err => err.msg);
    throw new BadRequestError(errorMessages.join(', '));
};

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER: 500
};

const success = (req, res, data, message, statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

export const handleError = {
    CustomError,
    BadRequestError,
    Unauthorized,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    InternalServerError,
    errorHandler,
    asyncHandler,
    validationErrorHandler,
    HTTP_STATUS,
    success
};