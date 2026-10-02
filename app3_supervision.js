const { request } = require('undici'); 
async function desplegarDashboard() { 
  process.stdout.write('\x1Bc'); 
  console.log('\x1b[48;5;88m%%s\x1b[0m', ' '.repeat(ancho)); 
  console.log('\x1b[48;5;88m\x1b[38;5;220m%%s\x1b[0m', ' 🏛️  TABLERO DE CONTROL DE LA TRANSFORMACIÓN VIAL '.padEnd(ancho)); 
  console.log('\x1b[48;5;88m%%s\x1b[0m', ' '.repeat(ancho)); 
  try { 
    const res = await request('http://localhost:3000/api/supervision/mapa'); 
    const datos = await res.body.json(); 
    console.log(`\n🚦 Monitoreo Urbano (Actualización Automática y Autoadaptable al Ancho)`); 
    console.log('─'.repeat(ancho)); 
    datos.forEach(b =
      const tag = b.estado === 'PENDIENTE' ? '\x1b[41m PENDIENTE \x1b[0m' : '\x1b[42m REPARADO \x1b[0m'; 
      console.log(`            Ubicación: Lat: ${b.latitud}, Lon: ${b.longitud}`); 
      if(b.fecha_reparacion) console.log(`            Atendido: \x1b[32m${b.fecha_reparacion}\x1b[0m`); 
      console.log('─'.repeat(ancho)); 
    }); 
  } catch { console.log('\n Esperando conexión con el Servidor API Core...'); } 
} 
setInterval(desplegarDashboard, 2000); 
desplegarDashboard(); 
