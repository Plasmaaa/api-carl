/**
 * Global Error Handler Middleware
 * Catches and formats all errors with i18n support
 */

import { Request, Response, NextFunction } from 'express';
import i18next from 'i18next';
import { sendFormatted } from '../utils/formatters';

export interface ApiError extends Error {
    status?: number;
    code?: string;
}

const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);

    const status = err.status || 500;
    const code = err.code || 'INTERNAL_ERROR';
    const message = err.message || i18next.t('errors.internal_server_error');

    res.status(status);
    const format = (req.query.format as string) || 'json';
    sendFormatted(
        res,
        {
            error: {
                status,
                code,
                message,
                timestamp: new Date().toISOString(),
            },
            path: req.path,
            method: req.method,
        },
        format,
        'error'
    );
};

export default errorHandler;