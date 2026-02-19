@echo off
setlocal

echo [1/3] Очищення портів 8000 та 5173... 🕺🎂🚀🎉🧁✅
powershell -Command "Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }"
powershell -Command "Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }"

echo [2/3] Запуск Бекенду (FastAPI)... 🍰✨
start "Backend (8000)" cmd /c "python backend/main.py"

echo [3/3] Запуск Фронтенду (Vite)... 🕺🎉
start "Frontend (5173)" cmd /c "cd frontend && npm run dev -- --host"

echo.
echo Усе готово! 
echo Локально: http://localhost:5173
echo У мережі (для телефону): http://192.168.0.199:5173 🕺🎂🚀🎉🧁✅
echo 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀
pause
