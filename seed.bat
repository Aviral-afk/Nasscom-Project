@echo off
title HotelPro Seeder
cd /d "%~dp0server"
set "PATH=C:\Program Files\nodejs;%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%"
echo Seeding HotelPro database...
node seed.js
pause
