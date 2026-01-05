/**
 * Models index
 * Defines all Sequelize models and their associations
 * Import this file to ensure all relationships are registered
 */

import Game from './Game';
import Studio from './Studio';
import Review from './Review';

// Define associations in one place so that importing this file registers them.
Studio.hasMany(Game, {
    foreignKey: 'studioId',
    as: 'games',
});

Game.belongsTo(Studio, {
    foreignKey: 'studioId',
    as: 'studio',
});

Game.hasMany(Review, {
    foreignKey: 'gameId',
    as: 'reviews',
});

Review.belongsTo(Game, {
    foreignKey: 'gameId',
    as: 'game',
});

export { Game, Studio, Review };
