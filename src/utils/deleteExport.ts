import fs from "fs"
import __dirname from "../utils.js";

/*
El propósito de este archivo es ejecutarlo antes de levantar el sitio para que elimine la línea correspondiente al
export {}; que genera TypeScript en el archivo public/js/script.js. Dicho archivo lo lee el navegador, que no soporta ni necesita al export
*/

const rutaAlArchivo = `${__dirname}/public/js/script.js`

fs.readFile(rutaAlArchivo, 'utf8', (error, data) => {
    if (error) throw error;

    const lines = data.split('\n'); // Divide el código por líneas y las junta en un array

    const newLines = lines.filter(line => line !== "export {};") // Crea un array con todas las líneas de "lines" menos la que contenga un "export {};"

    const modifiedContent = newLines.join('\n'); // Une las nuevas líneas

    fs.writeFile(rutaAlArchivo, modifiedContent, 'utf8', (error) => { // Sobreescribe el contenido
        if (error) throw error;
    });
});
