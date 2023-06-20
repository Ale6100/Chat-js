import mongoose from 'mongoose';
import config from "./config/config.js";
import logger from './utils/logger.js';

const conectarBaseDeDatos = async () => {
    if (config.mongo.url) {
        try {
            await mongoose.connect(config.mongo.url);

            mongoose.connection.on('error', error => {
                logger.fatal(error);
            });

            logger.info(`Base de mongo conectada`);
        } catch (error) {
            logger.fatal(error);
        }
    }
}

conectarBaseDeDatos();
