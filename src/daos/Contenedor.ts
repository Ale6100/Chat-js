import chatModel from "../models/chat.js";

const stringAleatorio = (n: number): string => { // Recibe un número "n" natural, devuelve un string con carácteres aleatorios de longitud "n"
    if (!Number.isInteger(n) || n <= 0) throw new Error(`stringAleatorio debe recibir número natural. Se ha recibido ${JSON.stringify(n)} (${typeof n})`)
    const simbolos = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789¡!¿?@#$%&()+-=*,.;:_"
    let stringRandom = ""
    for (let i=1; i<=n; i++) {
        stringRandom += simbolos[Math.floor(simbolos.length*Math.random())]
    }
    return stringRandom
}

interface Menssage {
    user: string,
    message: string,
    fecha: string,
    hora: string,
    timestamp?: number,
    code?: string,
    image: string,
    id?: string,
    respuestaGuardada: {
        authorCapturado: string,
        mensajeCapturado: string,
        imagenCapturada: string
    }
}

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
        return await this.model.find({}) as Menssage[]
    }

    async saveOne(document: Menssage) { // Recibe un documento, lo guarda en la colección, le coloca un id único y devuelve ese id
        document.timestamp = Date.now()
        document.code = stringAleatorio(10)
        const documentSaveModel = new this.model(document)
        const saveOne_ = await documentSaveModel.save()
        return saveOne_._id.valueOf() as string
    }

    async deleteOne(id: string) {
        await this.model.deleteOne({ _id: id })
    }

    async deleteAll() { // Vacía la colección
        await this.model.deleteMany({})
    }
}

export default Contenedor
