# Sala de chat

Bienvenido! Te invito a conocer mi primer chat grupal. Tengo muchas cosas en mente todavía, pero es lo suficientemente funcional como para que lo puedas usar. 

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

Es necesario la creación de dos variables de entorno mediante la elaboración de un archivo .env en el mismo nivel de la carpeta src. Este archivo debe ser completado con los siguientes campos, los cuales deberán ser modificados con tus propias credenciales en lugar del valor X.

```env
MONGO_URL = X # URL de mongo, la que ponemos dentro de mongoose.connect(X)

TOKEN_DELETE_MESSAGE = X # Token de seguridad que sólo conoce el "administrador", lo habilita a eliminar mensajes
```

## Desarrollo 👷

La carpeta de trabajo es [src](/src) y su archivo principal se ubica en [src/app.ts](src/app.ts). Realiza las modificaciones que desees y, cuando estés listo, ejecuta el siguiente comando:

```
npm run tsc-copy
```

Este comando se encarga de crear una carpeta `dist` lista para su uso: primero compilará todos los archivos TypeScript y los guardará en `dist`, luego copiará todos los archivos restantes de `src` a `dist`, manteniendo así la estructura de organización, y finalmente eliminará el "export {};" generado por TypeScript del archivo `script.js` que lee el navegador.

Recomiendo eliminar o vaciar la carpeta `dist` antes de ejecutar dicho comando.

## Despliegue 📦

Para ejecutar el proyecto compilado, utiliza el comando:

```
npm start
```

Podrás empezar a utilizarlo sin problemas luego de que aparezcan dos mensajes, el primero es "Servidor escuchando en el puerto 8080" (puerto configurado por defecto) y el segundo es "Base de mongo conectada".

## Construido con 🛠️

* CSS
* JavaScript
* [TypeScript](https://www.typescriptlang.org/)
* [NodeJs](https://nodejs.org/)
* [ExpressJs](https://expressjs.com/)
* [Socket.IO](https://socket.io/)
* [mongoose](https://mongoosejs.com/)
* [EJS](https://ejs.co/)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [Sweet Alert 2](https://sweetalert2.github.io/)
* [toastify-js](https://www.npmjs.com/package/toastify-js)
* [copyfiles](https://www.npmjs.com/package/copyfiles)

## Autor ✒️

* **Alejandro Portaluppi** - [LinkedIn](https://www.linkedin.com/in/alejandro-portaluppi/)
