import { Router } from "express";
import chatControllers from "../controllers/chat.controllers.js";

const router = Router();

router.delete("/eliminarMensaje", chatControllers.eliminarMensaje)

export default router
