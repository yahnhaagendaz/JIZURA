@echo off
chcp 65001 >nul
title JIZURA 字面 — 文字PV动力学引擎
cd /d "%~dp0"

echo ===================================================================
echo    JIZURA 字面 — 文字PV动力学引擎
echo ===================================================================
echo.

:: 优先检测系统 Python 3
set "PYTHON_EXE="
where python >nul 2>nul
if %errorlevel% equ 0 (
    set "PYTHON_EXE=python"
) else if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" (
    set "PYTHON_EXE=%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
) else if exist "%LOCALAPPDATA%\Programs\Python\Python311\python.exe" (
    set "PYTHON_EXE=%LOCALAPPDATA%\Programs\Python\Python311\python.exe"
) else if exist "%LOCALAPPDATA%\Programs\Python\Python310\python.exe" (
    set "PYTHON_EXE=%LOCALAPPDATA%\Programs\Python\Python310\python.exe"
) else if exist "%ProgramFiles%\Python312\python.exe" (
    set "PYTHON_EXE=%ProgramFiles%\Python312\python.exe"
) else if exist "%ProgramFiles%\Python311\python.exe" (
    set "PYTHON_EXE=%ProgramFiles%\Python311\python.exe"
)

if defined PYTHON_EXE (
    set "PORT=8520"
    set "JIZURA_PROJECTS_DIR=%~dp0..\projects"
    set "JIZURA_NO_BROWSER="
    "%PYTHON_EXE%" build.py
    if errorlevel 1 goto end
    echo [环境] 检测到 Python 运行环境，正在启动 WebCodecs 硬件加速极速服务...
    "%PYTHON_EXE%" server.py
    goto end
)

:: 若均无运行环境，直接使用系统默认浏览器打开单文件版 index.html
echo [提示] 未检测到 Python 运行环境。
echo [注意] 工程列表、自动存盘、音频绑定需要 Python 本地服务。
echo [提示] 正在使用默认浏览器直接打开 index.html...
echo [注意] 本地双击 html 模式下可正常预览、微调、导出工程与PNG序列帧；
echo        若需使用 GPU 硬件加速极速导出 MP4 视频，建议安装 Python 3 获得完整体验。
echo.
start "" "%~dp0index.html"

:end
pause
