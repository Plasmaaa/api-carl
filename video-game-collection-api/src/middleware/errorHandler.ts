import { Request, Response, NextFunction } from 'express';
import i18next from 'i18next';

export interface ApiError extends Error {
    status?: number;
    code?: string;
}

const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);

    const status = err.status || 500;
    const code = err.code || 'INTERNAL_ERROR';
    const message = err.message || i18next.t('errors.internal_server_error');

    res.status(status).json({
        error: {
            status,
            code,
            message,
            timestamp: new Date().toISOString(),
        },
        path: req.path,
        method: req.method,
    });
};

export default errorHandler;