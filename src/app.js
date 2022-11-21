"use strict";

import express from "express";
import __dirname from "./utils.js"
import Contenedor from "./Managers/Contenedor.js"
import { Server } from "socket.io";
import chatRouter from "./routes/views.chat.routes.js"

const app = express();

const PORT = process.env.PORT || 8080; // Elige el puerto 8080 en caso de que no tenga
const server = app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${server.address().port}`));

const io = new Server(server) // io va a ser el servidor del socket. Va a estar conectado con nuestro servidor actual

server.on("error", error => console.log(error));

app.set("views", `${__dirname}/views`); // Ubicación de las vistas
app.set("view engine", "ejs"); // Configuramos EJS como el motor de visualización de nuestra app

app.use(express.static(__dirname + "/public")); // Quiero que mi servicio de archivos estáticos se mantenga en public

app.use("/", chatRouter)

let mensajes = []; // Array que contiene información de cada mensaje

const contenedorHistorialChats = new Contenedor("historialChats")

contenedorHistorialChats.getAll().then(response => mensajes = response) // Antes de iniciar el chat (justo después del npm start) recupera los mensajes del historial en caso de que haya

io.on("connection", socket => {
    socket.emit("logs", mensajes) // Envío al usuario el array para que le muestre el historial de mensajes apenas se loguee

    socket.on("message", data => { // Recibo los datos de los mensajes emitidos en chat.js
        mensajes.push(data)
        io.emit("logs", mensajes) // Enviamos al io en vez de al socket para que el array llegue a todos los sockets (usuarios)
        contenedorHistorialChats.save( data ) // Guardo los datos (el mensaje que se envió junto con su usuario) y la fecha en un archivo json llamado "historialChats.json" //! Gracias a esto el chat no puede funcionar mientras desarrollemos con nodemon, ya que al guardar el objeto estaríamos actualizando el código y nodemon lo ejecutaría de nuevo, provocando que los sockets se reinicien y el chat se borre del DOM
    })

    socket.on("autenticado", data => {
        socket.broadcast.emit("newUserConnected", data) // El brodcast hace que se envíe a todos menos al socket (usuario) que desencadena el evento
    })
})
