@echo off
title HotelPro Client
cd /d "%~dp0client"
set "PATH=C:\Program Files\nodejs;%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%"
echo Starting HotelPro Client on port 3000...
node node_modules\vite\bin\vite.js --port 3000
pause
