import { Router } from 'express';
import gamesController from '../../controllers/gamesController';

const router = Router();

// GET all games
router.get('/', gamesController.getAllGames.bind(gamesController));

// POST create game
router.post('/', gamesController.createGame.bind(gamesController));

// GET single game
router.get('/:id', gamesController.getGame.bind(gamesController));

// PATCH update game (partial)
router.patch('/:id', gamesController.updateGame.bind(gamesController));

// DELETE game
router.delete('/:id', gamesController.deleteGame.bind(gamesController));

export default router;