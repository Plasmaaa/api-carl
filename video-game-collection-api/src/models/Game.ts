import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection';

export interface GameAttributes {
    id?: number;
    title: string;
    genre: string;
    releaseDate: Date;
    platform: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Game extends Model<GameAttributes> implements GameAttributes {
    public id!: number;
    public title!: string;
    public genre!: string;
    public releaseDate!: Date;
    public platform!: string;
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
    },
    {
        sequelize,
        tableName: 'games',
        timestamps: true,
    }
);

export default Game;