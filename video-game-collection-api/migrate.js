#!/usr/bin/env node
/**
 * Database Migration Script
 * Syncs all models with the database
 * Usage: npm run migrate
 */

require('dotenv').config();
const sequelize = require('./dist/database/connection').default;
const Game = require('./dist/models/Game').default;

async function migrate() {
    try {
        console.log('🔄 Starting database migration...');
        
        // Sync all models
        await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
        
        console.log('✓ Database migration completed successfully');
        console.log('✓ All tables synchronized');
        
        process.exit(0);
    } catch (error) {
        console.error('✗ Migration failed:', error.message);
        process.exit(1);
    }
}

migrate();
