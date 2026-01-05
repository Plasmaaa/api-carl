/**
 * Game Model
 * Represents a video game in the collection
 * Includes relationships with Studio and Review models
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database/connection';

export interface GameAttributes {
    id?: number;
    title: string;
    genre: string;
    releaseDate: Date;
    platform: string;
    studioId?: number | null;
    createdAt?: Date;
    updatedAt?: Date;
}

type GameCreationAttributes = Optional<GameAttributes, 'id' | 'studioId' | 'createdAt' | 'updatedAt'>;

export class Game extends Model<GameAttributes, GameCreationAttributes> implements GameAttributes {
    public id!: number;
    public title!: string;
    public genre!: string;
    public releaseDate!: Date;
    public platform!: string;
    public studioId!: number | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Game.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },
        genre: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100],
            },
        },
        releaseDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        platform: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isIn: [['PlayStation', 'Xbox', 'Nintendo Switch', 'PC', 'Mobile', 'Web']],
            },
        },
        studioId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'studios',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
    },
    {
        sequelize,
        tableName: 'games',
        timestamps: true,
    }
);

export default Game;