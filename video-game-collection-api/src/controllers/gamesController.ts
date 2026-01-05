import { Request, Response } from 'express';
import i18next from 'i18next';
import Game from '../models/Game';
import Studio from '../models/Studio';
import Review from '../models/Review';
import { addHATEOAS } from '../utils/hateoas';
import { sendFormatted } from '../utils/formatters';
import { validateGameCreation, validateGameUpdate } from '../utils/validators';

/**
 * Controller for managing video game resources
 * Handles all CRUD operations with i18n, HATEOAS, and multiple format support
 */
class GamesController {
    /**
     * Extract API version from request base URL
     */
    private getVersionFromBaseUrl(baseUrl: string): string {
        const segments = baseUrl.split('/');
        return segments.length >= 3 ? segments[2] : 'v1';
    }

    /**
     * Get response format from request
     */
    private getFormat(req: Request): string {
        return (req.query.format as string) || 'json';
    }

    /**
     * Handle errors consistently across all endpoints
     */
    private handleError(res: Response, error: Error, format: string, status: number = 500): void {
        res.status(status);
        sendFormatted(
            res,
            {
                error: i18next.t('errors.internal_server_error'),
                details: error.message,
            },
            format,
            'error'
        );
    }

    /**
     * GET all games - 200
     * Returns a collection of all games with studio and review relationships
     */
    public async getAllGames(req: Request, res: Response): Promise<void> {
        try {
            const games = await Game.findAll({
                include: [
                    { model: Studio, as: 'studio' },
                    { model: Review, as: 'reviews' },
                ],
            });

            const apiVersion = this.getVersionFromBaseUrl(req.baseUrl || '/api/v1/games');
            const gamesWithHATEOAS = games.map((game) => addHATEOAS(game.toJSON(), 'game', game.id, apiVersion));
            const format = this.getFormat(req);

            res.status(200);
            sendFormatted(
                res,
                {
                    data: gamesWithHATEOAS,
                    message: i18next.t('games.list_success'),
                },
                format,
                'games'
            );
        } catch (error) {
            this.handleError(res, error as Error, this.getFormat(req));
        }
    }

    /**
     * GET single game - 200, 404
     * Returns a specific game by ID with relationships
     */
    public async getGame(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const format = this.getFormat(req);
            const apiVersion = this.getVersionFromBaseUrl(req.baseUrl || '/api/v1/games');

            const game = await Game.findByPk(id, {
                include: [
                    { model: Studio, as: 'studio' },
                    { model: Review, as: 'reviews' },
                ],
            });

            if (!game) {
                res.status(404);
                sendFormatted(
                    res,
                    {
                        error: i18next.t('errors.game_not_found'),
                    },
                    format,
                    'error'
                );
                return;
            }

            const gameWithHATEOAS = addHATEOAS(game.toJSON(), 'game', game.id, apiVersion);
            res.status(200);
            sendFormatted(
                res,
                {
                    data: gameWithHATEOAS,
                    message: i18next.t('games.get_success'),
                },
                format,
                'game'
            );
        } catch (error) {
            this.handleError(res, error as Error, this.getFormat(req));
        }
    }

    /**
     * POST create game - 201
     * Creates a new game with validation
     */
    public async createGame(req: Request, res: Response): Promise<void> {
        try {
            const { title, genre, releaseDate, platform, studioId } = req.body;
            const format = this.getFormat(req);
            const apiVersion = this.getVersionFromBaseUrl(req.baseUrl || '/api/v1/games');

            // Validate input
            const validation = validateGameCreation({ title, genre, releaseDate, platform, studioId });
            if (!validation.valid) {
                res.status(400);
                sendFormatted(
                    res,
                    {
                        error: i18next.t('errors.validation_error'),
                        details: validation.errors,
                    },
                    format,
                    'error'
                );
                return;
            }

            // Create game
            const game = await Game.create({
                title,
                genre,
                releaseDate,
                platform,
                studioId: studioId ?? null,
            });

            const gameWithHATEOAS = addHATEOAS(game.toJSON(), 'game', game.id, apiVersion);
            res.status(201);
            sendFormatted(
                res,
                {
                    data: gameWithHATEOAS,
                    message: i18next.t('games.create_success'),
                },
                format,
                'game'
            );
        } catch (error: any) {
            const format = this.getFormat(req);
            res.status(400);
            sendFormatted(
                res,
                {
                    error: i18next.t('errors.validation_error'),
                    details: error.errors?.map((e: any) => e.message) || error.message,
                },
                format,
                'error'
            );
        }
    }

    /**
     * PATCH update game (partial) - 200, 404
     * Updates specific fields of an existing game
     */
    public async updateGame(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updates = req.body;
            const format = this.getFormat(req);
            const apiVersion = this.getVersionFromBaseUrl(req.baseUrl || '/api/v1/games');

            // Validate input
            const validation = validateGameUpdate(updates);
            if (!validation.valid) {
                res.status(400);
                sendFormatted(
                    res,
                    {
                        error: i18next.t('errors.validation_error'),
                        details: validation.errors,
                    },
                    format,
                    'error'
                );
                return;
            }

            // Find game
            const game = await Game.findByPk(id, {
                include: [
                    { model: Studio, as: 'studio' },
                    { model: Review, as: 'reviews' },
                ],
            });

            if (!game) {
                res.status(404);
                sendFormatted(
                    res,
                    {
                        error: i18next.t('errors.game_not_found'),
                    },
                    format,
                    'error'
                );
                return;
            }

            // Only update provided fields (partial update)
            const allowedFields = ['title', 'genre', 'releaseDate', 'platform', 'studioId'];
            const fieldsToUpdate: Record<string, any> = {};

            allowedFields.forEach((field) => {
                if (updates.hasOwnProperty(field)) {
                    fieldsToUpdate[field] = updates[field];
                }
            });

            await game.update(fieldsToUpdate);

            const gameWithHATEOAS = addHATEOAS(game.toJSON(), 'game', game.id, apiVersion);
            res.status(200);
            sendFormatted(
                res,
                {
                    data: gameWithHATEOAS,
                    message: i18next.t('games.update_success'),
                },
                format,
                'game'
            );
        } catch (error: any) {
            const format = this.getFormat(req);
            res.status(400);
            sendFormatted(
                res,
                {
                    error: i18next.t('errors.validation_error'),
                    details: error.errors?.map((e: any) => e.message) || error.message,
                },
                format,
                'error'
            );
        }
    }

    /**
     * DELETE game - 204, 404
     * Deletes a game by ID
     */
    public async deleteGame(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const format = this.getFormat(req);

            const game = await Game.findByPk(id);

            if (!game) {
                res.status(404);
                sendFormatted(
                    res,
                    {
                        error: i18next.t('errors.game_not_found'),
                    },
                    format,
                    'error'
                );
                return;
            }

            await game.destroy();
            res.status(204).send();
        } catch (error) {
            this.handleError(res, error as Error, this.getFormat(req));
        }
    }
}

export default new GamesController();