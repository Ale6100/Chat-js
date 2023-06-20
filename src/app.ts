import express, { Request, Response } from "express";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import http from "http";
import Contenedor from "./daos/Contenedor.js";
import { newMessage, savedMessage } from "./types.js";
import "./connectMongo.js";
import config from "./config/config.js";
import cors from "cors"
import corsOptions from "./middlewares/cors.js";
import logger from "./utils/logger.js";
import chatRouter from "./routes/chat.routes.js";
import addLogger from "./middlewares/addLogger.js";
import validateToken from "./middlewares/validateToken.js";

const app = express();

const PORT = process.env["PORT"] || 8080; // Elige el puerto 8080 en caso de que no tenga

const server: http.Server = app.listen(PORT, () => { // Escuchamos en el puerto cada vez que se reconozca un nuevo proceso worker. Todos los procesos se comparten el mismo puerto
    const address = server.address();

    if (typeof address === "object" && address !== null) {
        logger.info(`Servidor escuchando en el puerto ${address.port}`)
    }
});
server.on("error", error => logger.fatal(`${error}`))

const whitelist = [] // Habilito los frontend que no vengan como string vacío
if (config.site.urlfrontend) whitelist.push(config.site.urlfrontend)

if (whitelist.length === 0) logger.fatal("Debes colocar al menos una url frontend en las variables de entorno!")

app.set("views", `${__dirname}/views`); // Ubicación de las vistas
app.set("view engine", "ejs"); // Configuramos EJS como el motor de visualización de nuestra app

app.use(express.json()); // Especifica que podemos recibir json
app.use(express.urlencoded({ extended: true })); // Habilita poder procesar y parsear datos más complejos en la url

app.use(cors(corsOptions(whitelist)))
app.use(addLogger)
app.use(validateToken)

app.use("/api", chatRouter)
app.get("/", (_req: Request, res: Response) => {
    res.render("index.ejs", { urlFront: config.site.urlfrontend })
})

const io = new Server(server, { // io va a ser el servidor del socket. Va a estar conectado con nuestro servidor actual
    maxHttpBufferSize: 1e6, // 1MB | Tamaño máximo de envío de datos con socket.io
    cors: {
        origin: config.site.urlfrontend
    }
});

server.on("error", error => console.log(error));

const contenedorHistorialChats = new Contenedor("historialChats")

let mensajes: savedMessage[] = []; // Array que contiene información de cada mensaje

io.on('connection', socket => {
    socket.on("message", async (data: newMessage) => { // Recibo los datos de los mensajes emitidos en chat.js       
        const messageSaved = await contenedorHistorialChats.saveOne( data ) // Guardo en una colección de Mongo al objeto con los datos del mensaje que se envió 
        
        mensajes.push(messageSaved)
        
        io.emit("logs", mensajes) // Enviamos al io en vez de al socket para que el array llegue a todos los sockets (usuarios)
    })

    socket.on("autenticado", async (nameUser: string) => {
        mensajes = await contenedorHistorialChats.getAll()
        
        logger.info(`Nuevo cliente conectado: ${nameUser}`);

        socket.emit("mensajesPasados", mensajes)

        socket.broadcast.emit("newUserConnected", nameUser) // El brodcast hace que se envíe a todos menos al socket (usuario) que desencadena el evento
    })

    socket.on("actualizar", data => {
        mensajes = data.data
        io.emit("logs", mensajes)
    })
});
