const fs = require("fs");
const path = require("path");

const SKIP_RECURSION_DIRS = ["node_modules", ".git", "dist", ".angular/cache"]; // Carpeta que se muestra pero NO se recorre

function shouldSkipRecursion(relativePath) {
    // Normalizar separadores para compatibilidad cross-platform
    const normalized = relativePath.replace(/\\/g, "/");
    return SKIP_RECURSION_DIRS.some(skipDir => normalized.endsWith(skipDir));
}

function printTree(dir, prefix = "", basePath = ".") {
    let files;
    try {
        files = fs.readdirSync(dir);
    } catch (err) {
        console.error(`❌ Error al leer el directorio: ${dir}`);
        return;
    }

    files.forEach((file, index) => {
        const filePath = path.join(dir, file);
        const relPath = path.relative(basePath, filePath); // Ruta relativa desde la raíz
        const isLast = index === files.length - 1;
        const stat = fs.statSync(filePath);
        const isDir = stat.isDirectory();

        console.log(`${prefix}${isLast ? "└──" : "├──"} ${file}`);

        if (isDir && !shouldSkipRecursion(relPath)) {
            printTree(filePath, prefix + (isLast ? "    " : "│   "), basePath);
        }
    });
}

// Iniciar desde la raíz del proyecto
printTree(".");
