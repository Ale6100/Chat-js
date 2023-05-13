import multer from "multer";
import __dirname from "../utils.js";

const storage = multer.diskStorage({ // Configura un almacenamiento de servidor en disco
    destination: (req, file, cb) => { // Destino (la ruta ya debe estar creada)
        cb(null, __dirname + "/public/images")
    },
    filename: (req, file, cb) => { // Nombre del archivo cargado
        const fecha = new Date().toLocaleDateString().replaceAll("/", "_")
        const hora = new Date().toLocaleTimeString().replaceAll(":", "_")
        cb(null, `${fecha}-${hora}-${file.originalname}`)
    }
})

const uploader = multer({ storage }); // Lo guardamos para poder utilizarlo luego

export default uploader