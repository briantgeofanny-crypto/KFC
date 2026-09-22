@echo off
title SHADOWSPIRE: CHRONICLES OF ASCENSION - PWA App Launcher
echo ===================================================================
echo     MEMBUKA GAME SHADOWSPIRE: CHRONICLES OF ASCENSION...
echo ===================================================================

where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Menjalankan Aplikasi ShadowSpire dengan Server PWA...
    python "%~dp0serve_app.py"
) else (
    echo [INFO] Python tidak terdeteksi, membuka file game langsung...
    start "" "%~dp0index.html"
)
