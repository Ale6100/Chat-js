declare const io: any; // No quise hacer esto, pero no poseo el tipado de estas funciones ya que las importo mediante link CDN
declare const Swal: any;
declare const Toastify: any;

const socket = io({ // Inicializamos socket del lado del cliente
    autoConnect: false
}); 

let user: string;

const esNumerico = (string: string) => {
    return !isNaN(Number(string)) && string !== "" && !string.includes(" ");
}

Swal.fire({ // Muestra una alerta que te pide tu nombre
    title: "Identifícate",
    input: "text",
    text: "Por favor ingresa tu nombre de usuario",
    inputValidator: (value: string) => { // Valida que en el imput no coloquemos un string numérico o vacío
        value = value.trim()
        if (esNumerico(value)) return "¡Utiliza un nombre de usuario válido!"
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
}).then((result: { value: string }) => {
    user = result.value
    socket.connect() // Le pedimos que se conecte cuando el usuario ingresó un nombre válido
    socket.emit("autenticado", user)
})

const convertToBase64 = async (file: File) => { // Convierte una imagen a formato base64. Fuente: https://www.youtube.com/watch?v=pfxd7L1kzio&ab_channel=DailyTuition
    return new Promise((res, rej) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            res(fileReader.result)
        }
        fileReader.onerror = (error) => {
            rej(error)
        }
    })
}

const respuesta = document.querySelector(".contenedor-chat__respuesta")

const form = document.getElementById("form-chat") as HTMLFormElement | null

form?.addEventListener("submit", async e => {
    e.preventDefault()

    interface ObjInt {
        [key: string]: FormDataEntryValue
    }

    const formData = new FormData(form)
    const obj: ObjInt = {}
    formData.forEach((value, key) => obj[key] = value)

    const imageSize = (obj.imageForm as { size: number } ).size;

    if (imageSize >= 1000000) { // Si la imagen supera los 1MB, rechaza el mensaje (técnicamente debería considera el tamaño de la imagen más los otros datos, pero como pesan muy poco voy a hacer la vista gorda aunque no sea correcto. En el futuro cambiaré esto)
        return Toastify({
            text: "Por ahora el tamaño de la imagen no puede exceder 1MB",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #00b09b, rgb(125, 125, 61))",
                border: "2px solid black",
                borderRadius: "2px"
            }
        }).showToast();
    }

    const mensaje = (obj.mensaje as string).trim();

    const file = obj.imageForm as File | undefined
    let fileBase64 = ""
    
    if (file) {
        fileBase64 = await convertToBase64(file) as string
        if (fileBase64 !== "data:") {
            obj.image = fileBase64
        }
    }

    if (mensaje.length > 0 || obj.image) { // Se ejecuta si el mensaje es un string no vacío o si se quiere enviar una imagen       
        const fecha = new Date().toLocaleDateString() // Fecha y hora en la que se mandó el mensaje
        const hora = new Date().toLocaleTimeString()
        
        const authorCapturado = respuesta?.children[0]?.children[0].textContent
        
        const contenedorMensajeCitado = respuesta?.children[0]?.children[1]

        let mensajeCapturado, imagenCapturada

        const primerHijo = contenedorMensajeCitado?.children[0]
        const segundoHijo = contenedorMensajeCitado?.children[1]

        if (primerHijo instanceof HTMLImageElement) { // La posición de los "hijos" cambiará dependiendo de si el mensaje citado tiene mensaje / imagen / mensaje+imagen
            mensajeCapturado = ""
            imagenCapturada = primerHijo?.outerHTML
        } else {
            mensajeCapturado = primerHijo?.textContent
            imagenCapturada = segundoHijo?.outerHTML
        }

        const respuestaGuardada = {
            authorCapturado: authorCapturado,
            mensajeCapturado: mensajeCapturado,
            imagenCapturada: imagenCapturada
        }
        
        respuesta?.classList.add('hidden');
        respuesta?.classList.remove("seleccionado")
        if (respuesta) respuesta.innerHTML = ""

        socket.emit("message", { user, message: mensaje, fecha, hora, image: obj.image, respuestaGuardada }) // Emito un evento personalizado "message". Envío el usuario, el mensaje, la fecha, la hora y la url de la imagen en caso de que haya enviado
    }

    form.reset()
})

const logsPanel = document.querySelector(".logsPanel")

interface Menssage {
    user: string,
    message: string,
    fecha: string,
    hora: string,
    timestamp: number,
    code: string,
    image: string,
    _id?: string,
    respuestaGuardada: {
        authorCapturado: string,
        mensajeCapturado: string,
        imagenCapturada: string
    }
}

socket.on("logs", (data: Menssage[]) => { // Muestro los mensajes pasados, cada vez que se envía un nuevo mensaje y cada vez que se elimina uno
    if (!logsPanel) return ""
    logsPanel.innerHTML = ""
    let mensajesConsecutivosAcumulados = ""

    data.forEach((element, index) => { // Mapeo los mensajes. Considerar que es un forEach raro debido a que se requiere ordenar de una manera especial los mensajes
        // Estructura de cada mensaje
        const respuestaGuardada = element.respuestaGuardada
        const authorCapturado = respuestaGuardada?.authorCapturado ?? ""
        const mensajeCapturado = respuestaGuardada?.mensajeCapturado ?? ""
        const imagenCapturada = respuestaGuardada?.imagenCapturada ?? ""
        
        let cita = ""
        if (authorCapturado) {
            cita = `
            <div class="divRespuesta divCitado">
                <p>${authorCapturado}</p>
                <div class="divRespuesta__divCapturada">
                    <p>${mensajeCapturado}</p>
                    ${imagenCapturada}
                </div>
            </div>
            `
        }


        const mensaje = `
        <div class="mensajeIndividual">
            ${cita}
            <div class="mensajeIndividual__div">
                <div class="divMensajeImagen msg-${index}">
                    ${element.message ? `<p class="pMensaje">${element.message}</p>` : ""}
                    ${element.image ? `<img src="${element.image}" alt="Imagen enviada">` : ""}
                </div>
                <div>
                    <p class="pHora">${element.hora}</p>
                    <button id="btn-delete-${index}" class="pBasura">🗑️</button>
                    <div class="divOptions">
                        <button id="btn-option-${index}" class="pOption"><svg viewBox="0 0 18 18" height="18" width="18" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 18 18" xml:space="preserve"><path fill="currentColor" d="M3.3,4.6L9,10.3l5.7-5.7l1.6,1.6L9,13.4L1.7,6.2L3.3,4.6z"></path></svg></button>
                        <div>
                            <p>Responder</p>
                        </div>
                    </div>
                </div>
            </div>
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
            if ((etiqueta.children[0].children[0] as HTMLElement).innerText === user) {
                etiqueta.classList.add("flex-end")                
            }
        })

        logsPanel.scrollTop = logsPanel.scrollHeight // Hago que la barra siempre vaya abajo de todo cuando enviamos un mensaje
    })

    for (let index=0; index<data.length; index++) {
        const element = data[index];

        document.getElementById(`btn-delete-${index}`)?.addEventListener("click", () => {
            if (user.toLowerCase() === "ale" || user.toLowerCase() === "alejandro") { // Yo siempre uso estos nombres, pero si alguien más lo hace no hay problema porque igual tiene que poner contraseña
                Swal.fire({ // Muestra una alerta pidiéndote contraseña | Lo más normal sería que en realidad cada usuario pueda eliminar su propio mensaje, pero como no tengo un sistema de logueo se me ocurrió hacerlo por contraseña. Lamentablemente esta contraseña sólo la tengo que saber yo para que nadie elimine maliciosamente
                    title: "Eliminar mensaje",
                    input: "password",
                    text: "Debes ingresar una contraseña especial para eliminar mensajes",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                }).then( async (result: { value: string }) => {
                    const res = await fetch("/api/eliminarMensaje", {
                        method: "DELETE",
                        body: JSON.stringify({ id: element._id }),
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${result.value}`
                        }
                    }).then(res => res.json())

                    if (res.status === "error") {
                        Swal.fire({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 4000,
                            title: `${res.message ?? "Error, intente de nuevo más tarde"}`,
                            icon: "error"
                        })
                    } else {
                        Swal.fire({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 4000,
                            title: `${res.message}`,
                            icon: "success"
                        })
                        socket.emit("actualizar", { data: res.data }) 
                    }
                })
            } else {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 4000,
                    title: "Por el momento sólo el administrador puede eliminar mensajes",
                    icon: "info"
                })
            }
        })

        const buttonOptions = document.getElementById(`btn-option-${index}`)        

        buttonOptions?.addEventListener("click", () => { // Se encarga de definir la función de los botones del panel desplegable que hay en cada mensaje. Tengo pendiente explicar mejor esto
            const options = buttonOptions.nextElementSibling

            const author = buttonOptions?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.children[0].textContent

            if (options instanceof HTMLDivElement) {
                const escala = options.style.getPropertyValue("transform")

                if (escala === "scale(1)") {
                    options.style.setProperty("transform", "scale(0)")
                    options.style.setProperty("opacity", "0")
                } else {
                    options.style.setProperty("transform", "scale(1)")
                    options.style.setProperty("opacity", "1")
                }
          
                const pResponder = options.children[0]

                pResponder.addEventListener("click", () => {
                    const contMensajeCapturado = document.querySelector(`.msg-${index}`)
                    const mensajeCapturado = contMensajeCapturado?.children[0]?.outerHTML ?? ""
                    const imagenCapturada = contMensajeCapturado?.children[1]?.outerHTML ?? ""
                    
                    if (respuesta instanceof HTMLDivElement && typeof mensajeCapturado === "string" && typeof imagenCapturada === "string") {
                        const nuevaRespuesta = `
                        <div class="divRespuesta">
                            <p>${author}</p>
                            <div class="divRespuesta__div">
                                ${mensajeCapturado}
                                ${imagenCapturada}
                            </div>
                            <span class="spanCerrar"><svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="" fill="currentColor" enable-background="new 0 0 24 24" xml:space="preserve"><path d="M19.6004 17.2L14.3004 11.9L19.6004 6.60005L17.8004 4.80005L12.5004 10.2L7.20039 4.90005L5.40039 6.60005L10.7004 11.9L5.40039 17.2L7.20039 19L12.5004 13.7L17.8004 19L19.6004 17.2Z"></path></svg></span>
                        </div>
                        `
                        
                        if (respuesta.classList.contains("seleccionado")) {
                            if (respuesta.innerHTML === nuevaRespuesta) {
                                respuesta.classList.add('hidden');
                                respuesta.classList.remove("seleccionado")
                            } else {
                                respuesta.innerHTML = nuevaRespuesta
                            }
                                                    
                        } else {
                            respuesta.classList.remove('hidden');
                            respuesta.classList.add("seleccionado")
                            respuesta.innerHTML = nuevaRespuesta
                        }

                        document.querySelector(".spanCerrar")?.addEventListener("click", () => {
                            respuesta.classList.add('hidden');
                            respuesta.classList.remove("seleccionado")
                        })
                    }
                })
            }
        })
    }
})

socket.on("newUserConnected", (data: string) => { // Muestra una pequeña alerta cuando un usuario nuevo se conecta
    Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
        title: `${data} se ha unido al chat`,
        icon: "success"
    })
})