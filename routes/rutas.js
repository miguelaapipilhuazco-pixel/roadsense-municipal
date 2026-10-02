const db = require('../config/database');
const fs = require('fs');
const path = require('path');

function inicializarRutas(fastify, opts, next) {
  fastify.get('/api/descargar/database', async (req, res) => {
    const rutaDB = path.join(__dirname, '..', 'roadsense.db');
    if (fs.existsSync(rutaDB)) {
      res.header('Content-Disposition', 'attachment; filename=roadsense_backup.db');
      res.type('application/x-sqlite3');
      return fs.createReadStream(rutaDB);
    } else {
      return res.status(404).send({ error: 'Archivo no encontrado' });
    }
  });

  fastify.post('/api/telemetria', async (req, res) => {
    const { latitud, longitud, fuerza } = req.body;
    if (!latitud || !longitud || !fuerza) return res.status(400).send({ error: 'Datos incompletos' });

    const margen = 0.0001;
    const existente = db.prepare("SELECT id FROM baches WHERE ABS(latitud - ?) < ? AND ABS(longitud - ?) < ? AND estado = 'PENDIENTE'").get(latitud, margen, longitud, margen);

    if (existente) {
      db.prepare("UPDATE baches SET impactos_detectados = impactos_detectados + 1 WHERE id = ?").run(existente.id);
      return { status: 'confirmacion', id: existente.id };
    } else {
      const gravedad = fuerza >= 7 ? 'CRÍTICO' : 'REGULAR';
      const empresa = latitud > 19.4326 ? 'Cuadrilla Sector Norte' : 'Cuadrilla Sector Sur';
      db.prepare("INSERT INTO baches (latitud, longitud, gravedad, empresa_asignada) VALUES (?, ?, ?, ?)").run(latitud, longitud, gravedad, empresa);
      return { status: 'creado', asignado_a: empresa };
    }
  });

  fastify.get('/api/supervision/mapa', async () => db.prepare("SELECT * FROM baches ORDER BY estado DESC, id DESC").all());
  fastify.get('/api/contratista/:empresa', async (req) => db.prepare("SELECT * FROM baches WHERE empresa_asignada = ? AND estado = 'PENDIENTE'").all(req.params.empresa));
  
  fastify.post('/api/contratista/reparar', async (req, res) => {
    db.prepare("UPDATE baches SET estado = 'REPARADO', fecha_reparacion = datetime('now','localtime') WHERE id = ?").run(req.body.id);
    return { status: 'exito' };
  });

  next();
}

module.exports = inicializarRutas;
