import db from './db.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🌱 Seeding database...');

// Usuario demo
const password = await bcrypt.hash('demo123', 10);
const insertUser = db.prepare('INSERT OR IGNORE INTO users (email, password, name, role) VALUES (?, ?, ?, ?)');
insertUser.run('admin@trimpulso.cl', password, 'Admin', 'admin');
insertUser.run('user@trimpulso.cl', password, 'Usuario Demo', 'user');

console.log('✅ Usuarios creados');

// Importar datos desde JSON
const jsonPath = path.join(__dirname, '../../../data/contabilidad.json');
if (fs.existsSync(jsonPath)) {
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  
  const insertRecord = db.prepare(`
    INSERT INTO records (
      rut_emisor, razon_social, tipo_dte, folio_dte,
      fecha_emision, fecha_recepcion, monto_neto, monto_iva,
      monto_total, estado_rcv, codigo_impto, sheet_name, user_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((records) => {
    for (const record of records) {
      insertRecord.run(
        record.RUT_Emisor,
        record.Razon_Social_Emisor,
        record.Tipo_DTE,
        record.Folio_DTE,
        record.Fecha_Emision,
        record.Fecha_Recepcion,
        record.Monto_Neto,
        record.Monto_IVA,
        record.Monto_Total,
        record.Estado_RCV,
        record.Codigo_Impto,
        'Hoja1',
        1 // admin user
      );
    }
  });

  Object.entries(data.hojas).forEach(([sheetName, records]) => {
    insertMany(records);
    console.log(`✅ Importados ${records.length} registros de ${sheetName}`);
  });
}

console.log('✅ Seed completado');
db.close();
