"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sqlite3 = require('sqlite3').verbose();

var dbName = 'later.sqlite';
var db = new sqlite3.Database(dbName);
db.serialize(function () {
  // Створення таблиці користувачів
  var usersTableSql = "\n        CREATE TABLE IF NOT EXISTS users (\n            id INTEGER PRIMARY KEY,\n            username TEXT,\n            email TEXT,\n            password TEXT\n        )\n    "; // Створення таблиці для фотографій користувачів

  var photosTableSql = "\n        CREATE TABLE IF NOT EXISTS photos (\n            id INTEGER PRIMARY KEY,\n            user_id INTEGER,\n            photo_data BLOB,\n            FOREIGN KEY (user_id) REFERENCES users(id)\n        )\n    ";
  db.run(usersTableSql, function (err) {
    if (err) {
      return console.error('Помилка створення таблиці "users":', err.message);
    }

    console.log('Таблиця "users" успішно створена');
  });
  db.run(photosTableSql, function (err) {
    if (err) {
      return console.error('Помилка створення таблиці "photos":', err.message);
    }

    console.log('Таблиця "photos" успішно створена');
  });
});

var User = function User() {
  _classCallCheck(this, User);
};

module.exports.User = User;