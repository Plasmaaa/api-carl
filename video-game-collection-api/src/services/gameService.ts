import Game from '../models/Game';
import { validateGameCreation, validateGameUpdate } from '../utils/validators';
import { GameAttributes } from '../models/Game';

class GameService {
    // Get all games
    async getAllGames(): Promise<Game[]> {
        return await Game.findAll();
    }

    // Get game by ID
    async getGameById(id: number): Promise<Game | null> {
        return await Game.findByPk(id);
    }

    // Create a new game
    async createGame(gameData: GameAttributes): Promise<Game> {
        const validation = validateGameCreation(gameData);
        if (!validation.valid) {
            throw new Error(validation.errors.join(', '));
        }

        return await Game.create(gameData);
    }

    // Update game (partial)
    async updateGame(id: number, gameData: Partial<GameAttributes>): Promise<Game | null> {
        const validation = validateGameUpdate(gameData);
        if (!validation.valid) {
            throw new Error(validation.errors.join(', '));
        }

        const game = await Game.findByPk(id);
        if (!game) return null;

        return await game.update(gameData);
    }

    // Delete game
    async deleteGame(id: number): Promise<boolean> {
        const game = await Game.findByPk(id);
        if (!game) return false;

        await game.destroy();
        return true;
    }
}

export default new GameService();