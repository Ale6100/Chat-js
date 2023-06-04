# Sala de chat

Bienvenido! Te invito a conocer mi primer chat grupal. Tengo muchas cosas en mente todavía, pero es lo suficientemente funcional como para que lo puedas ojear. 

Utiliza la versión más reciente subida a la web [aquí](https://chat-js-ale.onrender.com/)

## Comenzando 🚀

Descarga el archivo comprimido .zip desde el botón verde "code" o haz click [aquí](https://github.com/Ale6100/Chat-js/archive/refs/heads/main.zip)

Mira **Despliegue** para saber cómo desplegar el proyecto en tu computadora.

### Pre-requisitos 📋

Necesitas tener previamente descargado e instalado [NodeJs](https://nodejs.org/).

También debes tener una cuenta en [MongoDB](https://mongodb.com/). Puedes modificarlo si deseas alguna alternativa.

### Instalación 🔧

Instala las dependencias con el comando

```
npm install
```

Se sugiere la creación de una variable de entorno mediante la elaboración de un archivo .env en el mismo nivel de la carpeta src. Este archivo debe ser completado con el siguiente, el cual deberá ser modificado con tus propias credenciales en lugar del valor X.

```
MONGO_URL = X | URL de mongo, la que ponemos dentro de mongoose.connect(X)
```

## Despliegue 📦

Corre el proyecto con el comando

```
npm start
```

No hay problema si decides utilizar monitores de archivos en tiempo real como `nodemon` u otras alternativas equivalentes, pero ten en cuenta que los mensajes desaparecerán del html después de guardar cambios en el código. Pero no te preocupes, simplemente actualiza el sitio web y volverán a aparecer.

Se pueden enviar imágenes en este chat pero lamentablemente tuve que desactivar dicha opción ya que en el sitio gratuito donde está subido el proyecto no me es posible hacerlo. Si deseas volver a activar la opción, simplemente debes entrar al archivo ubicado en [`/src/public/js/chat.js`](/src/public/js/chat.js) y eliminar o comentar el `addEventListener` de tipo `click` que le puse al elemento con id igual a `inputFile`.

## Construido con 🛠️

* CSS
* JavaScript
* [NodeJs](https://nodejs.org/)
* [ExpressJs](https://expressjs.com/)
* [Socket.IO](https://socket.io/)
* [mongoose](https://mongoosejs.com/)
* [EJS](https://ejs.co/)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [multer](https://www.npmjs.com/package/multer)

## Autor ✒️

* **Alejandro Portaluppi** - [LinkedIn](https://www.linkedin.com/in/alejandro-portaluppi/)
