@echo off
title HotelPro Server
cd /d "%~dp0server"
where node >nul 2>nul
if %errorlevel% neq 0 (
  set "PATH=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%"
)
echo Starting HotelPro Server on port 5000...
node server.js
pause
