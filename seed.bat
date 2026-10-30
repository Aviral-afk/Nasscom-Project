@echo off
title HotelPro Seeder
cd /d "%~dp0server"
where node >nul 2>nul
if %errorlevel% neq 0 (
  set "PATH=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%"
)
echo Seeding HotelPro database...
node seed.js
pause
