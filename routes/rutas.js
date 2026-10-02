const { sql } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');

function inicializarRutas(fastify, opts, next) {
  // 📥 Inicialización de la Tabla en la Nube (Endpoint de Control)
  fastify.get('/api/db/init', async (req, res) => {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS baches (
          id SERIAL PRIMARY KEY,
          latitud TEXT NOT NULL,
          longitud TEXT NOT NULL,
          gravedad TEXT NOT NULL,
          estado TEXT DEFAULT 'PENDIENTE',
          impactos_detectados INTEGER DEFAULT 1,
          empresa_asignada TEXT NOT NULL,
          fecha_deteccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          fecha_reparacion TEXT DEFAULT NULL
        );
      `;
      return { status: 'Base de datos Postgres inicializada en la nube de Vercel.' };
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  });

  // 🚗 API 1: Recibir Telemetría de los vehículos (Escáner de fondo)
  fastify.post('/api/telemetria', async (req, res) => {
    const { latitud, longitud, fuerza } = req.body;
    if (!latitud || !longitud || !fuerza) return res.status(400).send({ error: 'Datos incompletos' });
    
    try {
      const latNum = parseFloat(latitud);
      const lonNum = parseFloat(longitud);
      const margen = 0.0001;

      // Filtro de Inteligencia Serverless Postgres
      const { rows } = await sql`
        SELECT id, impactos_detectados FROM baches 
        WHERE ABS(CAST(latitud AS DOUBLE PRECISION) - ${latNum}) < ${margen} 
        AND ABS(CAST(longitud AS DOUBLE PRECISION) - ${lonNum}) < ${margen} 
        AND estado = 'PENDIENTE' 
        LIMIT 1;
      `;

      if (rows.length > 0) {
        const bacheId = rows[0].id;
        await sql`UPDATE baches SET impactos_detectados = impactos_detectados + 1 WHERE id = ${bacheId};`;
        return { status: 'confirmacion', id: bacheId };
      } else {
        const gravedad = fuerza >= 7 ? 'CRÍTICO' : 'REGULAR';
        const empresa = latNum > 19.4326 ? 'Cuadrilla Sector Norte' : 'Cuadrilla Sector Sur';
        
        await sql`
          INSERT INTO baches (latitud, longitud, gravedad, empresa_asignada) 
          VALUES (${latitud.toString()}, ${longitud.toString()}, ${gravedad}, ${empresa});
        `;
        return { status: 'creado', asignado_a: empresa };
      }
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  });

  // 📡 APIs para el Tablero de Control y Cuadrillas
  fastify.get('/api/supervision/mapa', async () => {
    const { rows } = await sql`SELECT * FROM baches ORDER BY estado DESC, id DESC;`;
    return rows;
  });

  fastify.get('/api/contratista/:empresa', async (req) => {
    const { rows } = await sql`SELECT * FROM baches WHERE empresa_asignada = ${req.params.empresa} AND estado = 'PENDIENTE';`;
    return rows;
  });
  
  fastify.post('/api/contratista/reparar', async (req, res) => {
    try {
      const fechaActual = new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" });
      await sql`UPDATE baches SET estado = 'REPARADO', fecha_reparacion = ${fechaActual} WHERE id = ${req.body.id};`;
      return { status: 'exito' };
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  });

  next();
}

module.exports = inicializarRutas;
