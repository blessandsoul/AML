@echo off
title AML - Auto Logistics Platform

:start
cls
echo ===================================
echo   AML - Auto Logistics Platform
echo ===================================
echo.
echo Checking ports 3000 and 3001...

REM Kill processes on ports
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo Killing process on port 3000 [PID: %%a]...
    taskkill /F /PID %%a 2>nul
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001" ^| findstr "LISTENING"') do (
    echo Killing process on port 3001 [PID: %%a]...
    taskkill /F /PID %%a 2>nul
)

REM Remove Next.js lock file if exists
if exist "client\.next\dev\lock" (
    echo Removing stale Next.js lock file...
    del /f /q "client\.next\dev\lock" 2>nul
)

timeout /t 1 /nobreak >nul

echo Starting Client (Next.js) on port 3000...
cd /d "c:\Users\User\Desktop\GITHUB\AML\client"
start "AML Client" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Server (Fastify API) on port 3001...
cd /d "c:\Users\User\Desktop\GITHUB\AML\server"
start "AML Server" cmd /k "npm run dev"

timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo ===================================
echo Client: http://localhost:3000
echo Server: http://localhost:3001
echo ===================================
echo.
echo [1] Restart Client
echo [2] Restart Server
echo [3] Restart All
echo [Q] Quit
echo.

:loop
choice /c 123Q /n /m "Select: "
if errorlevel 4 goto quit
if errorlevel 3 goto restart
if errorlevel 2 goto restart_server
if errorlevel 1 goto restart_client
goto loop

:restart_client
echo.
echo Restarting Client...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a 2>nul
)
timeout /t 2 /nobreak >nul
cd /d "c:\Users\User\Desktop\GITHUB\AML\client"
start "AML Client" cmd /k "npm run dev"
echo Client restarted.
timeout /t 1 /nobreak >nul
goto loop

:restart_server
echo.
echo Restarting Server...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a 2>nul
)
timeout /t 2 /nobreak >nul
cd /d "c:\Users\User\Desktop\GITHUB\AML\server"
start "AML Server" cmd /k "npm run dev"
echo Server restarted.
timeout /t 1 /nobreak >nul
goto loop

:restart
echo.
echo Restarting All...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a 2>nul
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a 2>nul
)
timeout /t 2 /nobreak >nul
goto start

:quit
echo.
echo Shutting down...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a 2>nul
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a 2>nul
)
echo Goodbye!
timeout /t 2 /nobreak >nul
exit
