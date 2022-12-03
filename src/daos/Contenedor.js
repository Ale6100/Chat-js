import chatModel from "../models/Chat.js"

const stringAleatorio = (n) => { // Devuelve un string aleatorio de longitud n
    const simbolos = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789¡!¿?@#$%&()+-=*,.;:_"
    let stringRandom = ""
    for (let i=1; i<=n; i++) {
        stringRandom += simbolos[parseInt(simbolos.length*Math.random())]
    }
    return stringRandom
}

// Esta clase crea un objeto que manipula una colección en MongoDB con documentos dentro. Dichos documentos pueden ser agregados, modificados, borrados y consultados

class Contenedor {
    constructor(nombreColeccion) {
        if (nombreColeccion === "historialChats") { // Analizo cuál modelo voy a utilizar, según sea el nombre de la colección que se haya pasado como parámetro
            this.model = chatModel
        } else {
            throw new Error(`Alto! Te falta crear y/o importar el modelo de ${nombreColeccion}`)
        }
    }

    async getAll() { // Devuelve un array con todos los documentos presentes en la colección
        return await this.model.find({})
    }

    async saveOne(document) { // Recibe un documento, lo guarda en la colección, le coloca un id único y devuelve ese id
        document.timestamp = Date.now()
        document.code = stringAleatorio(10)
        const documentSaveModel = new this.model(document)
        const saveOne_ = await documentSaveModel.save()
        return saveOne_._id.valueOf()
    }

    async deleteAll() { // Vacía la colección
        await this.model.deleteMany({})
    }
}

export default Contenedor
