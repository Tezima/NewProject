"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var fs = require('fs').promises;

var sqlite3 = require('sqlite3').verbose();

var path = require('path');

var app = express();
var port = 4000;
var dbName = 'user.sqlite';
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express["static"]('golovnaCSS'));
var db = new sqlite3.Database(dbName);
db.serialize(function _callee() {
  var dbExists, usersTableSql;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fs.access(dbName));

        case 3:
          dbExists = _context.sent;

          if (dbExists) {
            _context.next = 11;
            break;
          }

          usersTableSql = "\n                CREATE TABLE IF NOT EXISTS users (\n                    id INTEGER PRIMARY KEY,\n                    username TEXT,\n                    email TEXT,\n                    password TEXT\n                )\n            ";
          _context.next = 8;
          return regeneratorRuntime.awrap(db.run(usersTableSql));

        case 8:
          console.log('Таблиця "users" успішно створена');
          _context.next = 12;
          break;

        case 11:
          console.log('Файл бази даних вже існує');

        case 12:
          _context.next = 17;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          console.error('Помилка створення таблиці "users":', _context.t0.message);

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
app.get('/', function (req, res) {
  res.render('golovna');
});
app.get('/res_log', function (req, res) {
  res.render('reg_log');
});
app.get('/script.js', function (req, res) {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, '/views/profil/profil_js/script.js'));
});
app.get('/test.js', function (req, res) {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, '/views/test.js'));
});
app.get('/perexid.js', function (req, res) {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, '/views/profil/profil_js/perexid.js'));
});
app.get('/style.css', function (req, res) {
  res.set('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, '/views/profil/style.css'));
});
app.get('/golovnaCSS/picturegolovna/');
app.get('/img/:filename', function (req, res) {
  var filename = req.params.filename;
  var imagePath = path.join(__dirname, './views/profil/img/', filename);
  res.sendFile(imagePath);
});
app.use('/js', express["static"](path.join(__dirname, 'views')));
app.post('/register', function _callee2(req, res) {
  var userData, insertUserSql;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          userData = req.body;
          insertUserSql = "\n        INSERT INTO users (username, email, password) \n        VALUES (?, ?, ?)\n    ";
          _context2.prev = 2;
          _context2.next = 5;
          return regeneratorRuntime.awrap(db.run(insertUserSql, [userData.username, userData.email, userData.password]));

        case 5:
          console.log('Дані успішно збережені у базі даних');
          res.send('Реєстрація успішна');
          _context2.next = 13;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](2);
          console.error('Помилка збереження даних:', _context2.t0);
          res.status(500).send('Помилка збереження даних');

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 9]]);
});
app.listen(port, function () {
  console.log("\u0421\u0435\u0440\u0432\u0435\u0440 \u0437\u0430\u043F\u0443\u0449\u0435\u043D\u0438\u0439 \u043D\u0430 \u043F\u043E\u0440\u0442\u0456 ".concat(port));
});