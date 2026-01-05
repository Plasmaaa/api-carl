import 'dotenv/config';
import app from './app';
import sequelize from './database/connection';
import './models';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Sync database
        await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
        console.log('✓ Database synchronized successfully');

        // Start server
        app.listen(PORT, () => {
            console.log(`✓ Server is running on http://localhost:${PORT}`);
            console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('✗ Error starting server:', error);
        process.exit(1);
    }
};

startServer();