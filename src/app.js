"use strict";

import express from "express";
import __dirname from "./utils.js";
import Contenedor from "./daos/Contenedor.js";
import { Server } from "socket.io";
import viewsChatRouter from "./routes/views.chat.routes.js";
import chatRouter from "./routes/chat.routes.js";
import "./connectMongo.js";

const app = express();

const PORT = process.env.PORT || 8080; // Elige el puerto 8080 en caso de que no tenga
const server = app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${server.address().port}`));

const io = new Server(server) // io va a ser el servidor del socket. Va a estar conectado con nuestro servidor actual

server.on("error", error => console.log(error));

app.set("views", `${__dirname}/views`); // Ubicación de las vistas
app.set("view engine", "ejs"); // Configuramos EJS como el motor de visualización de nuestra app

app.use(express.json()); // Especifica que podemos recibir json
app.use(express.urlencoded({ extended: true })); // Habilita poder procesar y parsear datos más complejos en la url

app.use(express.static(__dirname + "/public")); // Quiero que mi servicio de archivos estáticos se mantenga en public

app.use("/", viewsChatRouter)
app.use("/api", chatRouter)

let mensajes = []; // Array que contiene información de cada mensaje

const contenedorHistorialChats = new Contenedor("historialChats")

// contenedorHistorialChats.deleteAll() // Descomentar sólo si se desea eliminar el chat

io.on("connection", async socket => { 
    const response = await contenedorHistorialChats.getAll()
    mensajes = response // Justo después de que un usuario se conecta, se recuperan los mensajes del historial en caso de que hayan

    socket.emit("logs", mensajes) // Envío al usuario el array de mensajes para que le muestre el historial

    socket.on("message", data => { // Recibo los datos de los mensajes emitidos en chat.js
        mensajes.push(data)
        io.emit("logs", mensajes) // Enviamos al io en vez de al socket para que el array llegue a todos los sockets (usuarios)
        contenedorHistorialChats.saveOne( data ) // Guardo los datos (el mensaje que se envió junto con su usuario) y la fecha en una colección de Mongo
    })
    
    socket.on("autenticado", data => {
        socket.broadcast.emit("newUserConnected", data) // El brodcast hace que se envíe a todos menos al socket (usuario) que desencadena el evento
    })
})

export { server }
