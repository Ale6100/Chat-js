import { Request, Response } from "express";
import config from "../config/config.js";
import Contenedor from "../daos/Contenedor.js";

const contenedorHistorialChats = new Contenedor("historialChats")

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
    eliminarMensaje
}
