import { Router } from "express";
import uploader from "../services/upload.js";
import chatControllers from "../controllers/chat.controllers.js";

const router = Router();

router.post("/guardarImagen", uploader.single('image'), chatControllers.guardarImagen)

router.delete("/eliminarMensaje", chatControllers.eliminarMensaje)

export default router
