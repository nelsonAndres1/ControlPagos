const { writeFileSync } = require('fs');
const { execSync } = require('child_process');

// Intentar obtener el hash corto del commit actual de Git
let commit = 'unknown';
try {
    commit = execSync('git rev-parse --short HEAD').toString().trim();
} catch {
    console.warn('No se pudo obtener el commit de Git.');
}

// Crear el objeto de versión
const version = {
    builtAt: new Date().toISOString(), // fecha y hora exacta de la build
    commit                           // hash del commit
};

// Guardar el archivo en src/assets/version.json
writeFileSync(
    'src/assets/version.json',
    JSON.stringify(version, null, 2) // con formato bonito
);

console.log('✅ version.json generado:', version);
