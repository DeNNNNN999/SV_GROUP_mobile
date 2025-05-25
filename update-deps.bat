@echo off
echo Удаляем старые зависимости...
rmdir /s /q node_modules
del package-lock.json

echo Устанавливаем правильные версии...
npm install

echo Готово! Теперь можно запускать приложение.
pause
