# Очищення портів 8000 та 5173
Write-Host "[1/3] Очищення портів 8000 та 5173... 🕺🎂🚀🎉🧁✅" -ForegroundColor Cyan
Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }

# Запуск Бекенду (FastAPI) в новому вікні PowerShell
Write-Host "[2/3] Запуск Бекенду (FastAPI)... 🍰✨" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"Set-Location -Path '$PWD'; python backend/main.py`"" -WindowStyle Normal

# Запуск Фронтенду (Vite) в новому вікні PowerShell
Write-Host "[3/3] Запуск Фронтенду (Vite)... 🕺🎉" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"Set-Location -Path '$PWD/frontend'; npm run dev -- --host`"" -WindowStyle Normal

Write-Host ""
Write-Host "Усе готово!" -ForegroundColor Green
Write-Host "Локально: http://localhost:5173" -ForegroundColor Yellow
Write-Host "У мережі (для телефону): http://192.168.0.199:5173 🕺🎂🚀🎉🧁✅" -ForegroundColor Yellow
Write-Host "🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀"
Read-Host "Натисніть Enter для виходу"

