const { request } = require('undici'); 
const readline = require('readline'); 
const rl = readline.createInterface({ input: process.stdin, output: process.stdout }); 
function render() { 
  process.stdout.write('\x1Bc'); 
  console.log('\x1b[48;5;88m%%s\x1b[0m', ' '.repeat(ancho)); 
  console.log('\x1b[48;5;88m\x1b[38;5;220m%%s\x1b[0m', ' 🚗 ROADSENSE MUNICIPAL - BIENESTAR VIAL '.padEnd(ancho)); 
  console.log('\x1b[48;5;88m%%s\x1b[0m', ' '.repeat(ancho)); 
  console.log('\n\x1b[1m[ ESCÁNER INVISIBLE EN SEGUNDO PLANO ]\x1b[0m\n'); 
  console.log('─'.repeat(ancho)); 
} 
function iniciar() { 
  render(); 
  rl.question('📍 Ingrese Latitud (Ej: 19.4326) > ', (lat) =
    rl.question('📍 Ingrese Longitud (Ej: -99.1332) > ', (lon) =
      rl.question('📊 Fuerza de impacto (Z: 1-10) > ', async (f) =
        try { 
          await request('http://localhost:3000/api/telemetria', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ latitud: parseFloat(lat), longitud: parseFloat(lon), fuerza: parseInt(f) }) }); 
          console.log('\n\x1b[32m✔ Telemetría enviada a la Nube Municipal.\x1b[0m'); 
        } catch { console.log('\n\x1b[31m❌ Error de conexión.\x1b[0m'); } 
        setTimeout(iniciar, 1500); 
      }); 
    }); 
  }); 
} 
iniciar(); 
