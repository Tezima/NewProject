@echo off
echo Запуск сервера...

REM Відкриття браузера Microsoft Edge з потрібною URL-адресою
start microsoft-edge:http://localhost:8080

REM Запуск Node.js сервера з вказаним файлом server.js
node "C:\Users\dimas\IdeaProjects\SERVER\MyEnglishv0_1\server.js"

REM Очікування користувача перед закриттям вікна
pause
