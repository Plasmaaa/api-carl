    import { Request, Response } from 'express';
import Game from '../models/Game';
import i18next from 'i18next';
import { addHATEOAS } from '../utils/hateoas';

class GamesController {
    // GET all games - 200
    public async getAllGames(req: Request, res: Response): Promise<void> {
        try {
            const games = await Game.findAll();
            const gamesWithHATEOAS = games.map((game) =>
                addHATEOAS(game.toJSON(), 'game', game.id)
            );
            res.status(200).json({
                data: gamesWithHATEOAS,
                message: i18next.t('games.list_success'),
            });
        } catch (error) {
            res.status(500).json({
                error: i18next.t('errors.internal_server_error'),
                details: (error as Error).message,
            });
        }
    }

    // GET single game - 200, 404
    public async getGame(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const game = await Game.findByPk(id);

            if (!game) {
                res.status(404).json({
                    error: i18next.t('errors.game_not_found'),
                });
                return;
            }

            const gameWithHATEOAS = addHATEOAS(game.toJSON(), 'game', game.id);
            res.status(200).json({
                data: gameWithHATEOAS,
                message: i18next.t('games.get_success'),
            });
        } catch (error) {
            res.status(500).json({
                error: i18next.t('errors.internal_server_error'),
                details: (error as Error).message,
            });
        }
    }

    // POST create game - 201
    public async createGame(req: Request, res: Response): Promise<void> {
        try {
            const { title, genre, releaseDate, platform } = req.body;

            // Validation
            if (!title || !genre || !releaseDate || !platform) {
                res.status(400).json({
                    error: i18next.t('errors.validation_error'),
                    message: i18next.t('errors.missing_fields'),
                });
                return;
            }

            const game = await Game.create({
                title,
                genre,
                releaseDate,
                platform,
            });

            const gameWithHATEOAS = addHATEOAS(game.toJSON(), 'game', game.id);
            res.status(201).json({
                data: gameWithHATEOAS,
                message: i18next.t('games.create_success'),
            });
        } catch (error: any) {
            res.status(400).json({
                error: i18next.t('errors.validation_error'),
                details: error.errors?.map((e: any) => e.message) || (error as Error).message,
            });
        }
    }

    // PATCH update game (partial) - 200, 404
    public async updateGame(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updates = req.body;

            const game = await Game.findByPk(id);

            if (!game) {
                res.status(404).json({
                    error: i18next.t('errors.game_not_found'),
                });
                return;
            }

            // Only update provided fields (partial update)
            const allowedFields = ['title', 'genre', 'releaseDate', 'platform'];
            const fieldsToUpdate: any = {};

            allowedFields.forEach((field) => {
                if (updates.hasOwnProperty(field)) {
                    fieldsToUpdate[field] = updates[field];
                }
            });

            await game.update(fieldsToUpdate);

            const gameWithHATEOAS = addHATEOAS(game.toJSON(), 'game', game.id);
            res.status(200).json({
                data: gameWithHATEOAS,
                message: i18next.t('games.update_success'),
            });
        } catch (error: any) {
            res.status(400).json({
                error: i18next.t('errors.validation_error'),
                details: error.errors?.map((e: any) => e.message) || (error as Error).message,
            });
        }
    }

    // DELETE game - 204, 404
    public async deleteGame(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const game = await Game.findByPk(id);

            if (!game) {
                res.status(404).json({
                    error: i18next.t('errors.game_not_found'),
                });
                return;
            }

            await game.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({
                error: i18next.t('errors.internal_server_error'),
                details: (error as Error).message,
            });
        }
    }
}

export default new GamesController();