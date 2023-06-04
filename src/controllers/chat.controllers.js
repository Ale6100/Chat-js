import { server } from "../app.js";

const guardarImagen = (req, res) => { // En /api/guardarImagen con el método POST guardo las imágenes enviadas por los usuarios. Devuelve la url de la imagen guardada
    try {
        if (req.file) {
            let urlImage
            if (req.hostname.includes("127.0.0")) {
                urlImage = `${req.protocol}://${req.hostname}:${server.address().port}/images/${req.file.filename}`
            } else {
                urlImage = `https://${req.hostname}/images/${req.file.filename}`
            }
            res.status(200).send({ status: "success", imageSent: true, payload: urlImage })
        } else {
            res.status(200).send({ status: "success", imageSent: false })
        }
    } catch (error) {
        res.status(500).send({ status: "error", error })
    }
}

export default {
    guardarImagen
}
