import { Request, Response, NextFunction } from "express";
import config from "../config/config.js"

const validateToken = (req: Request, res: Response, next: NextFunction) => {    
    const token = req.headers.authorization?.split(" ")[0] === "Bearer" && req.headers.authorization?.split(" ")[1]; // Token enviado en el encabezado de la petición

    if (token === config.token.gral) {
        next() // Permitimos el acceso del cliente sólo si en los encabezados coloca el token de acceso, utilizando el esquema de autenticación Bearer
    
    } else {
        req.logger.error(`${req.infoPeticion} | Forbidden | Token de acceso inválido`)
        res.status(403).send({ status: "error", "error": 'Forbidden | Token de acceso inválidos' })    
    }
}

export default validateToken
