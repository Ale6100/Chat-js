const socket = io({ // Inicializamos socket del lado del cliente
    autoConnect: false
}); 

let user;

Swal.fire({ // Muestra una alerta que te pide tu nombre
    title: "Identifícate",
    input: "text",
    text: "Por favor ingresa tu nombre de usuario",
    inputValidator: (value) => { // Valida que en el imput no coloquemos un string numérico o vacío
        if (!isNaN(value)) { 
            return "¡Utiliza un nombre de usaurio válido!"
        }
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
}).then(result => {
    user = result.value
    socket.connect() // Le pedimos que se conecte cuando el usuario ingresó un nombre válido
    socket.emit("autenticado", user)
})

const chatBox = document.getElementById("chatBox")

chatBox.addEventListener("keyup", e => {
    if (e.key === "Enter") {
        const mensaje = chatBox.value.trim() // Quita los espacios sobrantes al principio y al final del mensaje
        if (mensaje.length > 0) { // Se ejecuta si el mensaje es un string no vacío
            const fecha = new Date().toLocaleDateString() // Fecha y hora en la que se mandó el mensaje
            const hora = new Date().toLocaleTimeString()
            socket.emit("message", {user, message: mensaje, fecha, hora}) // Emito un evento personalizado "message". Envío el usuario, el mensaje, la fecha y la hora
            chatBox.value = ""
        }
    }
})

const logsPanel = document.getElementById("logsPanel")

socket.on("logs", data => { // Muestro los mensajes pasados
    logsPanel.innerHTML = ""
    let mensajesConsecutivosAcumulados = ""
    data.forEach((element, index) => {

        const mensaje = `
        <div>
            <p class="pMensaje">${element.message}</p>
            <p>${element.hora}</p>
        </div>
        `

        if (data.length === 1) { // Si sólo hay un mensaje para mostrar
            logsPanel.innerHTML += `
            <p class="fecha-inicial">----- ${element.fecha} -----</p>
            <div class="contenedor-cuerpoMensaje">
                <div class="cuerpoMensaje">
                    <p> <span class="userSpan">${element.user}</span></p>
                    ${mensaje}
                </div>
            </div>
            `
        } else {
            // Analizo si debo poner la fecha o no, de acuerdo a si hubo un cambio de día entre dos mensajes consecutivos
            if (index === 0) {
                logsPanel.innerHTML += `<p class="fecha-inicial">----- ${element.fecha} -----</p>`
            
            } else if (data[index].fecha !== data[index-1].fecha) {
                logsPanel.innerHTML += `<p class="fecha">----- ${element.fecha} -----</p>`
            }

            // Analizo si debo poner el nombre o no, de acuerdo a si hubo un cambio de usuario entre dos mensajes consecutivos
            if (index === 0) { // Guardamos el primer mensaje y hora
                mensajesConsecutivosAcumulados = `${mensaje}`

            } else if (index !== data.length-1) { // Entra en este if si no estamos en la última iteración
                if (data[index].user !== data[index-1].user) { // Cuando dos mensajes consecutivos son de distinto usuario
                    logsPanel.innerHTML += `
                    <div class="contenedor-cuerpoMensaje">
                        <div class="cuerpoMensaje">
                            <p> <span class="userSpan">${data[index-1].user}</span></p>
                            ${mensajesConsecutivosAcumulados}
                        </div>
                    </div>
                    ` // Se visualizan los mensajes previos guardados

                    mensajesConsecutivosAcumulados = `${mensaje}` // Se guarda únicamente el mensaje actual

                } else { // Cuando dos mensajes consecutivos son del mismo usuario
                    mensajesConsecutivosAcumulados += `${mensaje}` // Se guarda el mensaje actual a la lista
                }
            } else if (index === data.length-1) { // En la última iteración
                if (data[index].user !== data[index-1].user) { // Cuando los últimos dos mensajes son de distinto usuario
                    logsPanel.innerHTML += `
                    <div class="contenedor-cuerpoMensaje">
                        <div class="cuerpoMensaje">
                            <p> <span class="userSpan">${data[index-1].user}</span></p>
                            ${mensajesConsecutivosAcumulados}
                        </div>
                    </div>
                    ` // Se visualizan los mensajes previos guardados

                    logsPanel.innerHTML += `
                    <div class="contenedor-cuerpoMensaje">
                        <div class="cuerpoMensaje">
                            <p> <span class="userSpan">${element.user}</span></p>
                            ${mensaje}
                        </div>
                    </div>
                    ` // Se visualiza el último mensaje enviado
                } else { // Cuando los últimos dos mensajes son del mismo usuario
                    mensajesConsecutivosAcumulados += `${mensaje}` // Guardo el último mensaje

                    logsPanel.innerHTML += `
                    <div class="contenedor-cuerpoMensaje">
                        <div class="cuerpoMensaje">
                            <p> <span class="userSpan">${element.user}</span></p>
                            ${mensajesConsecutivosAcumulados}
                        </div>
                    </div>
                    ` // Se visualiza el último grupo de mensajes correspondiente al último usuario en enviar mensaje
                }
            }
        }

        document.querySelectorAll(".contenedor-cuerpoMensaje").forEach(etiqueta => { // Hago esto para que los mensajes enviados por el usuario actual se vean a la derecha, y el resto a la izquierda
            if (etiqueta.children[0].children[0].innerText === user) {
                etiqueta.classList.add("flex-end")                
            }
        })
        logsPanel.scrollTop = logsPanel.scrollHeight // Hago que la barra siempre vaya abajo de todo cuando enviamos un mensaje
    })
})

socket.on("newUserConnected", data => { // Muestra una pequeña alerta cuando un usuario nuevo se conecta
    Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        title: `${data} se ha unido al chat`,
        icon: "success"
    })
})
