const db = require('better-sqlite3')('roadsense.db'); 
function limpiar() { process.stdout.write('\x1Bc'); } 
function pausar(ms) { return new Promise(res => setTimeout(res, ms)); } 
async function ejecutarFlujo() { 
  limpiar(); 
  console.log('=================================================================='); 
  console.log('?? INICIANDO SIMULACI‡N DEL CICLO DE VIDA DEL DATO POR CMD'); 
  console.log('=================================================================='); 
  await pausar(1500); 
  console.log('\n?? [PASO 1] APP RECOLECCI‡N (M¢dulo 1): Un camion de basura cae en un bache.'); 
  console.log('?? Telemetria enviada de fondo: Lat: 19.4326, Lon: -99.1332, Fuerza Eje Z: 9'); 
  let lat = 19.4326, lon = -99.1332; 
  let empresa = lat > 19.4326 ? 'Asfaltos del Norte' : 'Pavimentos del Sur'; 
  let bacheId = db.prepare('INSERT INTO baches (latitud, longitud, gravedad, empresa_asignada) VALUES (?, ?, ?, ?)').run(lat, lon, 'ALTA', empresa).lastInsertRowid; 
  console.log(' bacheId ' + bacheId); 
  await pausar(3000); 
  console.log('\n?? [PASO 2] FILTRO DE INTELIGENCIA: Una patrulla pasa por la misma calle minutos despues.'); 
  console.log('?? Telemetria duplicada detectada. El servidor busca coincidencia de coordenadas...'); 
  db.prepare('UPDATE baches SET impactos_detectados = impactos_detectados + 1 WHERE id = ?').run(bacheId); 
  console.log(' Filtro Exitoso: Registro duplicado omitido. Bache #' + bacheId + ' ahora confirmado por 2 vehiculos.'); 
  await pausar(3000); 
  console.log('\n???  [PASO 3] DASHBOARD SUPERVISI‡N (M¢dulo 3): El Director de Obras Publicas ve el mapa.'); 
  let bacheActual = db.prepare('SELECT * FROM baches WHERE id = ?').get(bacheId); 
  console.log('------------------------------------------------------------------'); 
  console.log('   Estatus Actual: ' + bacheActual.estado + ' | Gravedad: ' + bacheActual.gravedad); 
  console.log('   Asignado a: ' + bacheActual.empresa_asignada); 
  console.log('   Verificacion: ' + bacheActual.impactos_detectados + ' impactos confirmados.'); 
  console.log('------------------------------------------------------------------'); 
  await pausar(3500); 
  console.log('\n?? [PASO 4] APP REPARACI‡N (M¢dulo 2): La cuadrilla de ' + bacheActual.empresa_asignada + ' acude al lugar.'); 
  console.log('?? Foto del \"Antes y Despues\" capturada. Subiendo evidencia a la consola...'); 
    db.prepare("UPDATE baches SET estado = 'REPARADO', fecha_reparacion = CURRENT_TIMESTAMP WHERE id = ?").run(bacheId); 
  console.log(' Evito: Bache #' + bacheId + ' reparado y cerrado.'); 
  await pausar(3000); 
  console.log('\n?? [PASO 5] VERIFICACI‡N FINAL: El panel del Gobierno se actualiza automaticamente.'); 
  let bacheCerrado = db.prepare('SELECT * FROM baches WHERE id = ?').get(bacheId); 
  console.log('------------------------------------------------------------------'); 
  console.log('   Estatus Actual: ' + bacheCerrado.estado + ' (Solucionado)'); 
  console.log('   Marca de tiempo de cierre: ' + bacheCerrado.fecha_reparacion); 
  console.log('=================================================================='); 
  console.log('≠Ciclo de vida del dato completado al 100%% por Consola!'); 
} 
ejecutarFlujo(); 
