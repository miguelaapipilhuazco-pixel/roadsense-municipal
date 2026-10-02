const { sql } = require('@vercel/postgres');

module.exports = async (req, res) => {
  // Asegurar encabezados CORS y tipo JSON para respuestas rápidas
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url;

  try {
    // 1. INICIALIZAR TABLAS EN LA NUBE
    if (url.includes('/api/db/init')) {
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
      return res.status(200).json({ status: 'Base de datos Postgres inicializada con éxito.' });
    }

    // 2. RECIBIR TELEMETRÍA AUTOMÁTICA DE LOS AUTOS
    if (url.includes('/api/telemetria') && req.method === 'POST') {
      let body = '';
      await new Promise((resolve) => {
        req.on('data', chunk => { body += chunk; });
        req.on('end', resolve);
      });
      
      const { latitud, longitud, fuerza } = JSON.parse(body);
      if (!latitud || !longitud || !fuerza) {
        return res.status(400).json({ error: 'Datos incompletos' });
      }

      const latNum = parseFloat(latitud);
      const lonNum = parseFloat(longitud);
      const margen = 0.0001;

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
        return res.status(200).json({ status: 'confirmacion', id: bacheId });
      } else {
        const gravedad = fuerza >= 7 ? 'CRÍTICO' : 'REGULAR';
        const empresa = latNum > 19.4326 ? 'Cuadrilla Sector Norte' : 'Cuadrilla Sector Sur';
        
        await sql`
          INSERT INTO baches (latitud, longitud, gravedad, empresa_asignada) 
          VALUES (${latitud.toString()}, ${longitud.toString()}, ${gravedad}, ${empresa});
        `;
        return res.status(200).json({ status: 'creado', asignado_a: empresa });
      }
    }

    // 3. CONSULTA COMPLETA PARA EL DASHBOARD DE SUPERVISIÓN
    if (url.includes('/api/supervision/mapa')) {
      const { rows } = await sql`SELECT * FROM baches ORDER BY estado DESC, id DESC;`;
      return res.status(200).json(rows);
    }

    // 4. CONSULTA PARA LAS CUADRILLAS EN CAMPO
    if (url.includes('/api/contratista/')) {
      const parts = url.split('/');
      const empresa = decodeURIComponent(parts[parts.length - 1]);
      const { rows } = await sql`SELECT * FROM baches WHERE empresa_asignada = ${empresa} AND estado = 'PENDIENTE';`;
      return res.status(200).json(rows);
    }

    // 5. REPARAR Y LIQUIDAR ALERTA VIAL
    if (url.includes('/api/contratista/reparar') && req.method === 'POST') {
      let body = '';
      await new Promise((resolve) => {
        req.on('data', chunk => { body += chunk; });
        req.on('end', resolve);
      });
      
      const { id } = JSON.parse(body);
      const fechaActual = new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" });
      await sql`UPDATE baches SET estado = 'REPARADO', fecha_reparacion = ${fechaActual} WHERE id = ${id};`;
      return res.status(200).json({ status: 'exito' });
    }

    // 6. DESCARGA REAL DE LA BASE DE DATOS RESPALDO
    if (url.includes('/api/descargar/database')) {
      const { rows } = await sql`SELECT * FROM baches;`;
      res.setHeader('Content-Disposition', 'attachment; filename=baches_municipal_backup.json');
      return res.status(200).send(JSON.stringify(rows, null, 2));
    }

    return res.status(404).json({ error: 'Ruta no encontrada' });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
