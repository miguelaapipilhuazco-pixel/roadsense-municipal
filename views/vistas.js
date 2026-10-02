const PORTAL_HTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Portal Bienestar Vial</title>
    <style>
        body{font-family:sans-serif;margin:0;background:#f8f9fa;color:#333;text-align:center}
        header{background:#561124;color:#dfb15b;padding:30px 10px;font-size:28px;font-weight:bold;box-shadow:0 4px 10px rgba(0,0,0,0.15)}
        .sub{color:#ffffff;font-size:16px;margin-top:5px;font-weight:normal}
        .container{max-width:900px;margin:30px auto;padding:10px;display:flex;justify-content:center;gap:20px;flex-wrap:wrap}
        .card{background:white;padding:25px;border-radius:6px;box-shadow:0 4px 8px rgba(0,0,0,0.05);width:260px;border-top:5px solid #561124;display:flex;flex-direction:column;justify-content:space-between}
        h3{margin:0 0 10px 0;color:#561124}
        p{font-size:14px;color:#666;line-height:1.4;margin-bottom:20px}
        .btn{background:#561124;color:#ffffff;text-decoration:none;padding:10px 15px;border-radius:4px;font-weight:bold;font-size:14px;transition:0.2s}
        .btn:hover{background:#3d0c19}
    </style>
</head>
<body>
    <header>🏛️ SISTEMA MUNICIPAL DE BIENESTAR VIAL<div class="sub">Centro de Distribución Tecnológica</div></header>
    <h2>Seleccione el módulo o herramienta que requiera:</h2>
    <div class="container">
        <div class="card">
            <h3>🏛️ Dashboard Web</h3>
            <p>Módulo de supervisión en tiempo real para el Ayuntamiento. Monitoreo de infraestructura y control vial.</p>
            <a href="/dashboard" class="btn">Abrir Panel</a>
        </div>
        <div class="card">
            <h3>👷 App de Cuadrillas</h3>
            <p>Plataforma web autoadaptable para trabajadores en campo. Gestión de alertas geolocalizadas del sector.</p>
            <a href="/contratista" class="btn">Acceder Módulo</a>
        </div>
        <div class="card">
            <h3>📦 Respaldo de Base de Datos</h3>
            <p>Descarga una copia completa y real del archivo SQLite (roadsense.db) para transparecia o respaldos locales.</p>
            <a href="/descargar/database" class="btn">Descargar DB</a>
        </div>
    </div>
</body>
</html>`;

const DASHBOARD_HTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Dashboard</title>
    <style>
        body{font-family:sans-serif;margin:0;background:#f8f9fa}
        header{background:#561124;color:#ffffff;padding:20px;text-align:center;font-size:24px;font-weight:bold}
        .container{max-width:900px;margin:20px auto;padding:10px}
        .box{background:white;padding:20px;margin-bottom:15px;border-left:8px solid #561124;border-radius:4px;box-shadow:0 3px 6px rgba(0,0,0,0.05);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}
        .tag{padding:6px 12px;border-radius:4px;color:white;font-weight:bold;font-size:12px;text-transform:uppercase}
        .PENDIENTE{background:#561124} .REPARADO{background:#28a745}
        .info{margin-top:5px;font-size:14px;color:#666}
        .back{display:inline-block;margin:15px;color:#561124;text-decoration:none;font-weight:bold}
    </style>
</head>
<body>
    <header>🏛️ TABLERO DE CONTROL - INFRAESTRUCTURA MUNICIPAL</header>
    <a href="/" class="back">← Volver al Hub Central</a>
    <div class="container" id="v"></div>
    <script>
        async function up(){
            const r = await fetch('/api/supervision/mapa');
            const d = await r.json();
            document.getElementById('v').innerHTML = d.map(b => \`
                <div class='box'>
                    <div>
                        <span class='tag \${b.estado}'>\${b.estado}</span> 
                        <strong style="margin-left:10px;">Bache #\${b.id}</strong> (\${b.gravedad})
                        <div class='info'>📍 Coordenadas: \${b.latitud}, \${b.longitud} | 🚗 Confirmaciones: \${b.impactos_detectados}</div>
                        \${b.fecha_reparacion ? \`<div style="font-size:12px;color:green;margin-top:4px;">Atendido el: \${b.fecha_reparacion}</div>\` : ''}
                    </div>
                    <div style='color:#561124;font-weight:bold;'>\${b.empresa_asignada}</div>
                </div>
            \`).join('');
        }
        setInterval(up,2000); up();
    </script>
</body>
</html>`;

const CONTRATISTA_HTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Cuadrillas</title>
    <style>
        body{font-family:sans-serif;margin:0;background:#f8f9fa}
        header{background:#561124;color:#ffffff;padding:15px;text-align:center;font-size:20px;font-weight:bold}
        .select-box{text-align:center;margin:20px}
        select{padding:10px 15px;font-size:16px;border:2px solid #561124;border-radius:4px;color:#561124;font-weight:bold}
        .container{max-width:500px;margin:auto;padding:10px}
        .box{background:white;padding:15px;margin-bottom:15px;border-radius:4px;border-left:8px solid #561124;box-shadow:0 3px 6px rgba(0,0,0,0.05);display:flex;justify-content:space-between;align-items:center}
        .btn{background:#561124;color:#ffffff;border:none;padding:10px 15px;cursor:pointer;font-weight:bold;border-radius:4px}
        .back{display:block;text-align:center;margin:10px;color:#561124;text-decoration:none;font-weight:bold}
    </style>
</head>
<body>
    <header>👷 CUADRILLAS EN CAMPO - TELEMETRÍA VIAL</header>
    <a href="/" class="back">← Volver al Hub Central</a>
    <div class="select-box"><select id="s" onchange="up()"><option value="Cuadrilla Sector Norte">Sector Norte</option><option value="Cuadrilla Sector Sur">Sector Sur</option></select></div>
    <div class="container" id="v"></div>
    <script>
        async function rep(id){
            await fetch('/api/contratista/reparar', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id})
            });
            up();
        }
        async function up(){
            const s = document.getElementById('s').value;
            const r = await fetch('/api/contratista/' + encodeURIComponent(s));
            const d = await r.json();
            document.getElementById('v').innerHTML = d.map(b => \`
                <div class='box'>
                    <div><strong>Bache #\${b.id}</strong> (\${b.gravedad})<div style="font-size:13px;color:#666;margin-top:3px;">📍 \${b.latitud}, \${b.longitud}</div></div>
                    <button class='btn' onclick='rep(\${b.id})'>Tapar Bache</button>
                </div>
            \`).join('');
        }
        setInterval(up,3000); up();
    </script>
</body>
</html>`;

module.exports = { PORTAL_HTML, DASHBOARD_HTML, CONTRATISTA_HTML };
