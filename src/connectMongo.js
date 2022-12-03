import mongoose from 'mongoose';
import key from "../keys/keys.js" // key privada

const password = key
const database = "chat" // Si no existe, la crea
const connection = mongoose.connect(`mongodb+srv://Ale6100:${password}@micluster.2ebvqqi.mongodb.net/${database}?retryWrites=true&w=majority`, error => {
    if (error) console.log(error);
    else console.log(`Base de mongo conectada. Database: ${database}`)
})
