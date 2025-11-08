import db, { initDatabase } from './db.js';

console.log('🔧 Inicializando base de datos...');
initDatabase();
console.log('✅ Base de datos lista');

// Cerrar conexión
db.close();
