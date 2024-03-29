import mongoose from "mongoose";

const collection = 'historialChats'; // Nombre de la colección a manipular

const schema = new mongoose.Schema({ // Estructura que tendrá cada documento
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: false
    },
    fecha: {
        type: String,
        required: true
    },
    hora: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: false 
    },
    respuestaGuardada: {
        type: Object,
        required: false
    }
});

const chatModel = mongoose.model(collection, schema);

export default chatModel;
