@echo off
cd /d "%~dp0"

:loop
git pull --ff-only origin main
timeout /t 10 /nobreak >nul
goto loop