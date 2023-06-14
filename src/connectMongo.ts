import mongoose from 'mongoose';
import config from "./config/config.js";

const conectarBaseDeDatos = async () => {
    if (config.mongo.url) {
        try {
            await mongoose.connect(config.mongo.url);

            mongoose.connection.on('error', error => {
                console.log(error);
            });

            console.log(`Base de mongo conectada`);
        } catch (error) {
            console.log(error);
        }
    }
}

conectarBaseDeDatos();
  