import mongoose from 'mongoose';
import config from "./config/config.js";

const connection = mongoose.connect(config.mongo.url, error => {
    if (error) console.log(error);
    else console.log(`Base de mongo conectada`)
})
