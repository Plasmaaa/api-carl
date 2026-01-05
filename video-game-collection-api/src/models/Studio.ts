/**
 * Studio Model
 * Represents a video game development studio
 * Has one-to-many relationship with Game model
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database/connection';

export interface StudioAttributes {
    id?: number;
    name: string;
    country: string;
    foundedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

type StudioCreationAttributes = Optional<StudioAttributes, 'id' | 'foundedAt' | 'createdAt' | 'updatedAt'>;

export class Studio extends Model<StudioAttributes, StudioCreationAttributes> implements StudioAttributes {
    public id!: number;
    public name!: string;
    public country!: string;
    public foundedAt!: Date | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Studio.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                len: [2, 255],
            },
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 255],
            },
        },
        foundedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'studios',
        timestamps: true,
    }
);

export default Studio;
