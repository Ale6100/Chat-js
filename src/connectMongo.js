import mongoose from 'mongoose';
import config from "./config/config.js";

mongoose.connect(config.mongo.url, error => {
    if (error) console.log(error);
    else console.log(`Base de mongo conectada`)
})
