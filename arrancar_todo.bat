@echo off 
chcp 65001 
start "1. Servidor Core" cmd /k "chcp 65001 ^& cd /d C:\Users\Dell\roadsense-municipal\api-core\roadsense-municipal\api-core ^& node server.js" 
timeout /t 2 
start "2. Dashboard Gobierno" cmd /k "chcp 65001 ^& cd /d C:\Users\Dell\roadsense-municipal\api-core\roadsense-municipal\api-core ^& node app3_supervision.js" 
start "3. App Recolección" cmd /k "chcp 65001 ^& cd /d C:\Users\Dell\roadsense-municipal\api-core\roadsense-municipal\api-core ^& node app1_recoleccion.js" 
start "4. App Contratistas" cmd /k "chcp 65001 ^& cd /d C:\Users\Dell\roadsense-municipal\api-core\roadsense-municipal\api-core ^& node app2_reparacion.js" 
