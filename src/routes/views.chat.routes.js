import { Router } from "express";
import uploader from "../services/upload.js";
import { server } from "../app.js";

const router = Router();

router.get("/", (req, res) => {
    res.render("chat"); // Renederizo chat.ejs
})

router.post("/guardarImagen", uploader.single('image'), async (req, res) => { // Se encarga de guardar las imágenes enviadas por los usuarios. Devuelve la url de la imagen guardada
    try {
        if (req.file) {
            let image
            if (req.hostname.includes("127.0.0")) {
                image = `${req.protocol}://${req.hostname}:${server.address().port}/images/${req.file.filename}`
            } else {
                image = `https://${req.hostname}/images/${req.file.filename}`
            }
            res.status(200).send({ status: "success", imageSent: true, payload: image })
        } else {
            res.status(200).send({ status: "success", imageSent: false })
        }        
    } catch (error) {
        res.status(500).send({ status: "error", error })
    }
})

export default router
