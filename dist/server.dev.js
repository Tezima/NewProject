"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var fs = require('fs').promises;

var sqlite3 = require('sqlite3').verbose();

var path = require('path');

var app = express();
var port = 3000;
var dbName = 'user.sqlite';
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express["static"]('golovnaCSS'));
var db = new sqlite3.Database(dbName);

(function _callee() {
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
})();

app.get('/', function (req, res) {
  res.render('golovna');
});
app.get('/res_log', function (req, res) {
  res.render('reg_log');
}); // Маршрут для відображення профілю користувача

app.get('/profil', function (req, res) {
  var _req$query = req.query,
      username = _req$query.username,
      email = _req$query.email;
  res.render('profil', {
    username: username,
    email: email
  });
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
app.get('/img/:filename', function (req, res) {
  var filename = req.params.filename;
  var imagePath = path.join(__dirname, './views/profil/img/', filename);
  res.sendFile(imagePath);
});
app.use('/js', express["static"](path.join(__dirname, 'views')));
app.post('/register', function _callee2(req, res) {
  var userData, emailRegex, selectUserSql, row, insertUserSql;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userData = req.body;

          if (!(userData.username.length < 3 || userData.username.length > 20)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).send('Ім\'я користувача повинно містити від 3 до 20 символів.'));

        case 4:
          emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          if (emailRegex.test(userData.email)) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(400).send('Введіть правильну електронну пошту.'));

        case 7:
          selectUserSql = "\n            SELECT * FROM users\n            WHERE username = ? OR email = ?\n        ";
          _context2.next = 10;
          return regeneratorRuntime.awrap(db.get(selectUserSql, [userData.username, userData.email]));

        case 10:
          row = _context2.sent;

          if (!row) {
            _context2.next = 15;
            break;
          }

          return _context2.abrupt("return", res.status(400).send('Користувач з таким ім\'ям або електронною поштою вже існує.'));

        case 15:
          insertUserSql = "\n                INSERT INTO users (username, email, password) \n                VALUES (?, ?, ?)\n            ";
          _context2.next = 18;
          return regeneratorRuntime.awrap(db.run(insertUserSql, [userData.username, userData.email, userData.password]));

        case 18:
          console.log('Дані успішно збережені у базі даних');
          res.send('Реєстрація успішна');

        case 20:
          _context2.next = 26;
          break;

        case 22:
          _context2.prev = 22;
          _context2.t0 = _context2["catch"](0);
          console.error('Помилка обробки реєстрації користувача:', _context2.t0.message);
          res.status(500).send('Помилка обробки реєстрації користувача');

        case 26:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 22]]);
});
app.post('/login', function _callee3(req, res) {
  var _req$body, username, password, selectUserSql, row;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body = req.body, username = _req$body.username, password = _req$body.password;
          selectUserSql = "\n            SELECT * FROM users\n            WHERE username = ? AND password = ?\n        ";
          _context3.next = 5;
          return regeneratorRuntime.awrap(db.get(selectUserSql, [username, password, id]));

        case 5:
          row = _context3.sent;

          if (row) {
            console.log('Користувач знайдений:', row); // Передаємо дані користувача через параметр запиту при переадресації

            res.redirect("/profile?username=".concat(row.username, "&email=").concat(row.email, "&id=").concat(row.id));
          } else {
            console.log('Користувача не знайдено');
            res.redirect('/');
          }

          _context3.next = 13;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.error('Помилка обробки входу користувача:', _context3.t0.message);
          res.status(500).send('Помилка обробки входу користувача');

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
app.listen(port, function () {
  console.log("\u0421\u0435\u0440\u0432\u0435\u0440 \u0437\u0430\u043F\u0443\u0449\u0435\u043D\u0438\u0439 \u043D\u0430 \u043F\u043E\u0440\u0442\u0456 ".concat(port));
});