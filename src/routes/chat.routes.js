import { Router } from "express";
import uploader from "../services/upload.js";
import chatControllers from "../controllers/chat.controllers.js";

const router = Router();

router.post("/guardarImagen", uploader.single('image'), chatControllers.guardarImagen)

export default router
