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

const form = document.getElementById("form-chat")

document.getElementById("inputFile").addEventListener("click", (e) => { //! Eliminar si se desea enviar imágenes
    e.preventDefault()
    Toastify({
        text: "Se pueden enviar imágenes en este chat, pero lamentablemente tuve que desactivar esta opción ya que en el sitio gratuito donde está subido el proyecto no me es posible hacerlo. Haz click aquí si deseas tener activada la opción siguiendo los pasos a seguir que anoté para que puedas crear tu propio chat",
        duration: 10000,
        destination: "https://github.com/Ale6100/Chat-js.git#sala-de-chat",
        newWindow: true,
        close: false,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #00b09b, rgb(125, 125, 61))",
            border: "2px solid black",
            borderRadius: "2px"
        }
    }).showToast();
})

form.addEventListener("submit", async e => {
    e.preventDefault()

    const formData = new FormData(form)
    const obj = Object.fromEntries(formData); // Convertimos el FormData a un objeto

    const mensaje = obj.mensaje.trim() // Quita los espacios sobrantes al principio y al final del mensaje
    const tamanioImagen = obj.image.size

    if (mensaje.length > 0 || tamanioImagen > 0) { // Se ejecuta si el mensaje es un string no vacío o si se quiere enviar una imagen
        const res = await fetch("/api/guardarImagen", { // Enviamos a esta ruta el formData. Se encargará de guardar una imagen si el usuario así lo quiso
            method: "POST",
            body: formData // Enviamos los datos al body. Multer se va a encargar de procesarlos
        }).then(res => res.json())

        const urlImagen = res.imageSent ? res.payload : undefined // Si el usuario envió una imagen, se envía junto con los demás datos
        
        const fecha = new Date().toLocaleDateString() // Fecha y hora en la que se mandó el mensaje
        const hora = new Date().toLocaleTimeString()
        socket.emit("message", { user, message: mensaje, fecha, hora, urlImagen: urlImagen }) // Emito un evento personalizado "message". Envío el usuario, el mensaje, la fecha, la hora y la url de la imagen en caso de que haya enviado
        chatBox.value = ""
    }

    form.reset()
})

const logsPanel = document.getElementById("logsPanel")

socket.on("logs", data => { // Muestro los mensajes pasados
    logsPanel.innerHTML = ""
    let mensajesConsecutivosAcumulados = ""

    data.forEach((element, index) => { // Mapeo los mensajes. Considerar que es un forEach raro debido a que se requiere ordenar de una manera especial los mensajes
        // Estructura de cada mensaje
        const mensaje = `
        <div>
            <div class="divMensajeImagen">
                ${element.message ? `<p class="pMensaje">${element.message}</p>` : ""}
                ${element.urlImagen ? `<img src="${element.urlImagen}" alt="Imagen enviada">` : ""}             
            </div>
            <p class="pHora">${element.hora}</p>
        </div>
        `

        if (data.length === 1) { // Si sólo hay un mensaje para mostrar
            logsPanel.innerHTML += `
            <p class="fecha">----- ${element.fecha} -----</p>
            <div class="contenedor-cuerpoMensaje">
                <div class="cuerpoMensaje">
                    <p> <span class="userSpan">${element.user}</span></p>
                    ${mensaje}
                </div>
            </div>
            `
        } else {
            const fechaActual = new Date(element.fecha.split('/').reverse().join('-')).getTime()
            const fechaAnterior = new Date(data[index-1]?.fecha.split('/').reverse().join('-')).getTime() // Uso el signo de pregunta ya que en la primera iteración, data[index-1] no está definido, pero no importa ya que en ese momento no lo necesitamos

            if (index === 0) { // Entra en este if si estamos en la primera iteración (correspondiente al primer mensaje)
                logsPanel.innerHTML = `<p class="fecha">----- ${element.fecha} -----</p>` // Al inicio siempre se mostrará la primera fecha
                mensajesConsecutivosAcumulados = `${mensaje}` // Guardamos el primer mensaje y hora

            } else if (index !== data.length-1) { // Entra en este if si no estamos ni en la primera iteración (mensaje) ni en la última
                if (data[index].user !== data[index-1].user) { // Cuando el mensaje actual y el anterior son de distinto usuario
                    // En un contenedor grande se visualizan todos los mensajes previos guardados, correspondiente al usuario anterior
                    logsPanel.innerHTML += `
                    <div class="contenedor-cuerpoMensaje">
                        <div class="cuerpoMensaje">
                            <p> <span class="userSpan">${data[index-1].user}</span></p>
                            ${mensajesConsecutivosAcumulados}
                        </div>
                    </div>
                    `

                    if (fechaActual !== fechaAnterior) { // Si además hubo un cambio de fecha, muestra la actual, correspondiente a la fecha del mensaje enviado por el nuevo usuario
                        logsPanel.innerHTML += `<p class="fecha">----- ${element.fecha} -----</p>`
                    }

                    mensajesConsecutivosAcumulados = `${mensaje}` // Se guarda únicamente el mensaje actual, correspondiente al nuevo usuario

                } else { // Cuando el mensaje actual y el anterior son del mismo usuario
                    if (fechaActual !== fechaAnterior) { // Si hubo un cambio de fecha, ponemos el globo con los mensajes viejos acumulados y la fecha actual
                        logsPanel.innerHTML += `
                        <div class="contenedor-cuerpoMensaje">
                            <div class="cuerpoMensaje">
                                <p> <span class="userSpan">${data[index-1].user}</span></p>
                                ${mensajesConsecutivosAcumulados}
                            </div>
                        </div>
                        <p class="fecha">----- ${element.fecha} -----</p>
                        `
                        mensajesConsecutivosAcumulados = ""
                    }
                    mensajesConsecutivosAcumulados += `${mensaje}` // Se guarda el mensaje actual a la lista
                }
            } else if (index === data.length-1) { // En la última iteración
                const fechaActual = new Date(element.fecha.split('/').reverse().join('-')).getTime()
                const fechaAnterior = new Date(data[index-1].fecha.split('/').reverse().join('-')).getTime()

                if (data[index].user !== data[index-1].user) { // Cuando los últimos dos mensajes son de distinto usuario
                    // En un contenedor grande se visualizan todos los mensajes previos guardados, correspondiente al usuario anterior
                    logsPanel.innerHTML += `
                    <div class="contenedor-cuerpoMensaje">
                        <div class="cuerpoMensaje">
                            <p> <span class="userSpan">${data[index-1].user}</span></p>
                            ${mensajesConsecutivosAcumulados}
                        </div>
                    </div>
                    `

                    if (fechaActual !== fechaAnterior) { // Si además hubo un cambio de fecha, muestra la actual, correspondiente a la fecha del mensaje enviado por el nuevo usuario
                        logsPanel.innerHTML += `<p class="fecha">----- ${element.fecha} -----</p>`
                    }

                    // Se visualiza el último mensaje enviado, correspondiente al nuevo usuario
                    logsPanel.innerHTML += `
                    <div class="contenedor-cuerpoMensaje">
                        <div class="cuerpoMensaje">
                            <p> <span class="userSpan">${element.user}</span></p>
                            ${mensaje}
                        </div>
                    </div>
                    `
                } else { // Cuando los últimos dos mensajes son del mismo usuario
                    if (fechaActual !== fechaAnterior) { // Si hubo un cambio de fecha
                        logsPanel.innerHTML += `
                        <div class="contenedor-cuerpoMensaje">
                            <div class="cuerpoMensaje">
                                <p> <span class="userSpan">${element.user}</span></p>
                                ${mensajesConsecutivosAcumulados}
                            </div>
                        </div>
                        <p class="fecha">----- ${element.fecha} -----</p>
                        `
                        mensajesConsecutivosAcumulados = ""
                    }

                    mensajesConsecutivosAcumulados += `${mensaje}` // Guardo el último mensaje

                    // Se visualiza el último grupo de mensajes correspondiente al último usuario en enviar mensaje
                    logsPanel.innerHTML += `
                    <div class="contenedor-cuerpoMensaje">
                        <div class="cuerpoMensaje">
                            <p> <span class="userSpan">${element.user}</span></p>
                            ${mensajesConsecutivosAcumulados}
                        </div>
                    </div>
                    `
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
