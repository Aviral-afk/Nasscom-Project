@echo off
title HotelPro Server
cd /d "%~dp0server"
set "PATH=C:\Program Files\nodejs;%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%"
echo Starting HotelPro Server on port 5000...
node server.js
pause
