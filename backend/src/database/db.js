import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../data/contabilidad.db');
const db = new Database(dbPath);

// Activar claves foráneas
db.pragma('foreign_keys = ON');

export function initDatabase() {
  // Tabla de usuarios
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabla de registros contables
  db.exec(`
    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rut_emisor TEXT,
      razon_social TEXT,
      tipo_dte INTEGER,
      folio_dte INTEGER,
      fecha_emision TEXT,
      fecha_recepcion TEXT,
      monto_neto REAL,
      monto_iva REAL,
      monto_total REAL,
      estado_rcv TEXT,
      codigo_impto INTEGER,
      sheet_name TEXT,
      imported_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Tabla de sesiones
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Índices para mejor rendimiento
  db.exec(`CREATE INDEX IF NOT EXISTS idx_records_fecha ON records(fecha_emision)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_records_rut ON records(rut_emisor)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)`);

  console.log('✅ Base de datos inicializada');
}

export default db;
