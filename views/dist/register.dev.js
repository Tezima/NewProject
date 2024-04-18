"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var fs = require('fs');

var sqlite3 = require('sqlite3').verbose();

var app = express();
var port = 3000; // Перевірка наявності файлу бази даних

var dbName = 'user.sqlite';
var dbExists = fs.existsSync(dbName); // Створення підключення до бази даних

var db = new sqlite3.Database(dbName); // Створення таблиці користувачів

db.serialize(function () {
  if (!dbExists) {
    var usersTableSql = "\n            CREATE TABLE IF NOT EXISTS users (\n                id INTEGER PRIMARY KEY,\n                username TEXT,\n                email TEXT,\n                password TEXT\n            )\n        ";
    db.run(usersTableSql, function (err) {
      if (err) {
        return console.error('Помилка створення таблиці "users":', err.message);
      }

      console.log('Таблиця "users" успішно створена');
    });
  } else {
    console.log('Файл бази даних вже існує');
  }
}); // Ваш клас User (тут код вашого класу User)
// Маршрути для отримання, створення та видалення користувачів (тут ваші маршрути)

app.listen(port, function () {
  console.log("\u0421\u0435\u0440\u0432\u0435\u0440 \u0437\u0430\u043F\u0443\u0449\u0435\u043D\u0438\u0439 \u043D\u0430 \u043F\u043E\u0440\u0442\u0456 ".concat(port));
});