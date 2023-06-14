import { Request, Response } from "express";

const renderChat = (_req: Request, res: Response) => { // En la ruta "/" renederizo chat.ejs
    res.render("chat"); 
}

export default {
    renderChat
}
