import chatModel from "../models/chat.js";
import { newMessage, savedMessage } from "../types.js";

// interface Menssage {
//     user: string,
//     message: string,
//     fecha: string,
//     hora: string,
//     timestamp?: number,
//     code?: string,
//     image: string,
//     id?: string,
//     respuestaGuardada: {
//         authorCapturado: string,
//         mensajeCapturado: string,
//         imagenCapturada: string
//     }
// }

// Esta clase crea un objeto que manipula una colección en MongoDB con documentos dentro. Dichos documentos pueden ser agregados, consultados, modificados y eliminados

class Contenedor {
    public model
    
    constructor(nombreColeccion: string) {
        if (nombreColeccion === "historialChats") { // Analizo cuál modelo voy a utilizar, según sea el nombre de la colección que se haya pasado como parámetro
            this.model = chatModel
        } else {
            throw new Error(`Alto! Te falta crear y/o importar el modelo de ${nombreColeccion}`)
        }
    }

    async getAll() { // Devuelve un array con todos los documentos presentes en la colección
        return await this.model.find({}) as savedMessage[]
    }

    async saveOne(document: newMessage) { // Recibe un documento, lo guarda en la colección y devuelve el documento con el _id y el timestamp agregado
        const newDocument = { ...document, timestamp: Date.now() }
        const documentSaveModel = new this.model(newDocument)
        const saveOne_ = await documentSaveModel.save()
        return saveOne_ as unknown as savedMessage
    }

    async deleteOne(id: string) {
        await this.model.deleteOne({ _id: id })
    }

    async deleteAll() { // Vacía la colección
        await this.model.deleteMany({})
    }
}

export default Contenedor
