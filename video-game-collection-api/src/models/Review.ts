/**
 * Review Model
 * Represents a review for a video game
 * Belongs to Game model
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database/connection';

export interface ReviewAttributes {
    id?: number;
    rating: number;
    comment?: string | null;
    reviewer?: string | null;
    gameId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

type ReviewCreationAttributes = Optional<ReviewAttributes, 'id' | 'comment' | 'reviewer' | 'createdAt' | 'updatedAt'>;

export class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
    public id!: number;
    public rating!: number;
    public comment!: string | null;
    public reviewer!: string | null;
    public gameId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Review.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 10,
            },
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        reviewer: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [0, 255],
            },
        },
        gameId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'games',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
    },
    {
        sequelize,
        tableName: 'reviews',
        timestamps: true,
    }
);

export default Review;
