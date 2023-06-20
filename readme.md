# Sala de chat | Parte backend

Bienvenido! Te invito a conocer mi primer chat grupal. Tengo muchas cosas en mente todavía, pero es lo suficientemente funcional como para que lo puedas usar.

La parte Frontend (necesaria para que funcione) se encuentra [aquí](https://github.com/Ale6100/Chat-ts-parte-front.git).

Utiliza la versión más reciénte del proyecto subido a la web [aquí](https://chat-ts.netlify.app/).

## Comenzando 🚀

Lee atentamente las siguientes instrucciones si deseas obtener una copia funcional del proyecto en tu computadora.

Descargar el archivo comprimido _zip_ desde el botón "code" o hacer click [aquí](https://github.com/Ale6100/Chat-js/archive/refs/heads/main.zip).

Mira **Despliegue** para conocer cómo desplegar el proyecto en tu computadora.

### Pre-requisitos 📋

Necesitas tener previamente descargado e instalado [NodeJs](https://nodejs.org/).

### Instalación 🔧

Instala las dependencias con el comando

```
npm install
```

Es necesario la creación de cuatro variables de entorno mediante la elaboración de un archivo .env en el mismo nivel de la carpeta src. Este archivo debe ser completado con los siguientes campos, los cuales deberán ser modificados con tus propias credenciales en lugar del valor X.

```env
MONGO_URL = X # URL de mongo, la que ponemos dentro de mongoose.connect(X)

TOKEN_DELETE_MESSAGE = X # Token de seguridad que sólo conoce el "administrador", lo habilita a eliminar mensajes

URL_FRONTEND = X # URL de tu frontend sin barra lateral final

TOKEN_GRAL = X # Token arbitrario personal, necesario para acceder a los endpoints
```

## Desarrollo 👷

La carpeta de trabajo es [src](/src) y su archivo principal se ubica en [src/app.ts](src/app.ts). Realiza las modificaciones que desees y, cuando estés listo, ejecuta el comando

```
tsc
```

Este comando compilará todos los archivos TypeScript y los guardará en la carpeta `dist`. Recomiendo eliminar o vaciar la carpeta antes de ejecutar dicho comando.

## Despliegue 📦

Para ejecutar el proyecto compilado, utiliza el comando:

```
npm start
```

Podrás empezar a utilizarlo sin problemas luego de que aparezcan dos mensajes, el primero es "Servidor escuchando en el puerto 8080" (puerto configurado por defecto) y el segundo es "Base de mongo conectada".

*Importante*: Asegúrate de que la [parte frontend](https://github.com/Ale6100/Chat-ts-parte-front.git) esté ejecutándose

## Construido con 🛠️

* [TypeScript](https://www.typescriptlang.org/)
* [NodeJs](https://nodejs.org/)
* [ExpressJs](https://expressjs.com/)
* [Socket.IO](https://socket.io/)
* [mongoose](https://mongoosejs.com/)
* [EJS](https://ejs.co/)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [winston](https://www.npmjs.com/package/winston)
* [cors](https://www.npmjs.com/package/cors)

## Autor ✒️

* **Alejandro Portaluppi** - [LinkedIn](https://www.linkedin.com/in/alejandro-portaluppi/)
