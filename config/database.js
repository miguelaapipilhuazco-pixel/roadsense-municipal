const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'roadsense.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS baches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    latitud REAL NOT NULL,
    longitud REAL NOT NULL,
    gravedad TEXT NOT NULL,
    estado TEXT DEFAULT 'PENDIENTE',
    impactos_detectados INTEGER DEFAULT 1,
    empresa_asignada TEXT NOT NULL,
    fecha_deteccion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_reparacion TEXT DEFAULT NULL
  );
`);

module.exports = db;
