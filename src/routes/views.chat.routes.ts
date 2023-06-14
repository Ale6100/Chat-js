import { Router } from "express";
import viewsChatControllers from "../controllers/views.chat.controllers.js";

const router = Router();

router.get("/", viewsChatControllers.renderChat)

export default router
