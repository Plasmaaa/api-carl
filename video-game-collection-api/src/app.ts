/**
 * Main Application Configuration
 * Sets up Express server with:
 * - i18next for internationalization
 * - Content negotiation
 * - API versioning (v1, v2)
 * - Error handling
 */

import express, { Request, Response, NextFunction } from 'express';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import path from 'path';
import errorHandler from './middleware/errorHandler';
import contentNegotiation from './middleware/contentNegotiation';
import v1Routes from './routes/v1/games';
import v2Routes from './routes/v2/games';
import { sendFormatted } from './utils/formatters';

const app = express();

// i18next configuration
i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
        fallbackLng: 'en',
        preload: ['en', 'fr', 'es'],
        backend: {
            loadPath: path.join(__dirname, '/locales/{{lng}}.json'),
        },
        detection: {
            order: ['querystring', 'header'],
            caches: ['cookie'],
        },
    });

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// i18next middleware
app.use(middleware.handle(i18next));

// Content negotiation middleware
app.use(contentNegotiation);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        message: i18next.t('welcome'),
        timestamp: new Date().toISOString(),
    });
});

// API versioning - v1
app.use('/api/v1/games', v1Routes);

// API versioning - v2
app.use('/api/v2/games', v2Routes);

// 404 handler
app.use((req: Request, res: Response) => {
    const format = (req.query.format as string) || 'json';
    res.status(404);
    sendFormatted(
        res,
        {
            error: i18next.t('errors.game_not_found'),
            path: req.path,
        },
        format,
        'error'
    );
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;