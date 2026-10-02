const { request } = require('undici'); 
const readline = require('readline'); 
const rl = readline.createInterface({ input: process.stdin, output: process.stdout }); 
async function verModulo(sector) { 
  process.stdout.write('\x1Bc'); 
  console.log('\x1b[48;5;88m%%s\x1b[0m', ' '.repeat(ancho)); 
  console.log('\x1b[48;5;88m\x1b[38;5;220m%%s\x1b[0m', ` 👷 SISTEMA DE INFRAESTRUCTURA - ${sector.toUpperCase()} `.padEnd(ancho)); 
  console.log('\x1b[48;5;88m%%s\x1b[0m', ' '.repeat(ancho)); 
  try { 
    const res = await request(`http://localhost:3000/api/contratista/${encodeURIComponent(sector)}`); 
    const lista = await res.body.json(); 
    console.log(`\n📋 Pendientes en el sector: (${lista.length})\n`); 
    lista.forEach(b =
