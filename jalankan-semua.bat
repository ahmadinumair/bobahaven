@echo off
echo ====================================================
echo Menjalankan Toko Milk Tea (Express + React Native)
echo ====================================================
start cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start cmd /k "cd frontend && npm run web"
echo Kedua server sedang berjalan!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:8081
pause

