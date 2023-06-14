import { Request, Response } from "express";
import config from "../config/config.js";
import Contenedor from "../daos/Contenedor.js";

const contenedorHistorialChats = new Contenedor("historialChats")

const guardarImagen = (req: Request, res: Response) => { // En /api/guardarImagen con el método POST guardo las imágenes enviadas por los usuarios. Devuelve la url de la imagen guardada
    try {
        if (req.file) {
            let urlImage = `/images/${req.file.filename}`
            res.status(200).send({ status: "success", imageSent: true, payload: urlImage })
        } else {
            res.status(200).send({ status: "success", imageSent: false })
        }
    } catch (error) {
        res.status(500).send({ status: "error", error })
    }
}

const eliminarMensaje = async (req: Request, res: Response) => { // En /api/eliminarMensaje con el método DELETE eliminamos un mensaje según su id pasado por el body, y devolvemos el nuevo historial modificado
    try {
        const { id } = req.body

        const token = req.headers.authorization?.split(" ")[0] === "Bearer" && req.headers.authorization?.split(" ")[1];
    
        if (config.token.deleteMessage === token) {
            await contenedorHistorialChats.deleteOne(id)
            const data = await contenedorHistorialChats.getAll()
            res.status(200).send({ status: "success", message: "Mensaje eliminado", data })
        } else {
            res.status(403).send({ status: "error", message: "Contraseña incorrecta" })
        }
    } catch (error) {
        res.status(500).send({ status: "error", error })
    }
}

export default {
    guardarImagen,
    eliminarMensaje
}
