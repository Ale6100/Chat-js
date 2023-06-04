import multer from "multer";
import __dirname from "../utils.js";

const storage = multer.diskStorage({ // Configura un almacenamiento de servidor en disco
    destination: (req, file, cb) => { // Ruta a la carpeta de destino. Ya debe estar creada
        cb(null, __dirname + "/public/images")
    },
    filename: (req, file, cb) => { // Nombre del archivo cargado
        const fecha = new Date().toLocaleDateString().replaceAll("/", "_")
        const hora = new Date().toLocaleTimeString().replaceAll(":", "_")
        cb(null, `${fecha}-${hora}-${file.originalname}`)
    }
})

// Verificación del tipo de archivo. Por ahora sólo acepto imágenes, pero luego se podrán enviar otros tipos de datos
function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Acepta el archivo si es una imagen, y la rechaza si no lo es
    } else {
        cb(null, false)
    }
  }

const uploader = multer({ storage, fileFilter }); // Lo guardamos para poder utilizarlo luego

export default uploader
