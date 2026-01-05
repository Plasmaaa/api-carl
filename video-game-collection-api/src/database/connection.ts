import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Prefer DATABASE_URL if provided, otherwise fall back to discrete env vars.
const databaseUrl = process.env.DATABASE_URL;

const sequelize = databaseUrl
    ? new Sequelize(databaseUrl, {
          dialect: 'postgres',
          logging: process.env.NODE_ENV === 'development' ? console.log : false,
      })
    : new Sequelize({
          dialect: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432', 10),
          username: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
          database: process.env.DB_NAME || 'video_games_db',
          logging: process.env.NODE_ENV === 'development' ? console.log : false,
      });

export default sequelize;