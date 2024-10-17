"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var fs = require('fs').promises;

var path = require('path');

var sqlite3 = require('sqlite3').verbose();

var sqlite = require('sqlite');

var multer = require('multer');

var session = require('express-session');

var app = express();
var port = 3000;
var dbName = 'user.sqlite';
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express["static"]('golovnaCSS'));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000
  }
})); // Middleware для логування IP-адреси користувача

app.use(function (req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log("IP-\u0430\u0434\u0440\u0435\u0441\u0430 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0430: ".concat(ip));
  next();
});
var db; // Ініціалізація бази даних

(function _callee() {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(sqlite.open({
            filename: dbName,
            driver: sqlite3.Database
          }));

        case 3:
          db = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(db.exec("\n            CREATE TABLE IF NOT EXISTS users (\n                id INTEGER PRIMARY KEY,\n                username TEXT,\n                email TEXT,\n                password TEXT\n            )\n        "));

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(db.exec("\n            CREATE TABLE IF NOT EXISTS photos (\n                id INTEGER PRIMARY KEY AUTOINCREMENT,\n                user_id INTEGER,\n                filename TEXT,\n                FOREIGN KEY (user_id) REFERENCES users(id)\n            )\n        "));

        case 8:
          console.log('Таблиці "users" та "photos" успішно створені або вже існують');
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.error('Помилка створення таблиць:', _context.t0.message);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
})(); // Налаштування multer для завантаження фотографій


var upload = multer({
  dest: 'uploads/'
}); // Маршрут для завантаження фото

app.post('/upload', upload.single('photo'), function _callee2(req, res) {
  var filename, userId, existingPhoto;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log('Користувач завантажує фото');
          _context2.prev = 1;
          filename = req.file.filename;
          userId = req.query.id; // Перевірка наявності фото у користувача

          _context2.next = 6;
          return regeneratorRuntime.awrap(db.get('SELECT filename FROM photos WHERE user_id = ?', userId));

        case 6:
          existingPhoto = _context2.sent;

          if (!existingPhoto) {
            _context2.next = 12;
            break;
          }

          console.log('Фото вже завантажено');
          res.status(400).send('Фото вже завантажено.');
          _context2.next = 16;
          break;

        case 12:
          _context2.next = 14;
          return regeneratorRuntime.awrap(db.run('INSERT INTO photos (user_id, filename) VALUES (?, ?)', [userId, filename]));

        case 14:
          console.log('Фотографія успішно завантажена');
          res.status(200).send('Фотографія успішно завантажена');

        case 16:
          _context2.next = 22;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](1);
          console.error('Помилка завантаження фотографії:', _context2.t0.message);
          res.status(500).send('Помилка завантаження фотографії');

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 18]]);
}); // Маршрут для відображення фото

app.get('/uploads/:filename', function (req, res) {
  var filename = req.params.filename;
  console.log("\u041A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447 \u043F\u0435\u0440\u0435\u0433\u043B\u044F\u0434\u0430\u0454 \u0444\u043E\u0442\u043E: ".concat(filename));
  res.sendFile(path.join(__dirname, './uploads/', filename));
});
app.get('/', function (req, res) {
  console.log('Користувач відвідує головну сторінку');
  res.render('golovna');
});
app.get('/res_log', function (req, res) {
  console.log('Користувач переходить на сторінку реєстрації/входу');
  res.render('reg_log');
});
app.get('/test', function (req, res) {
  console.log('Користувач переходить на сторінку тести');
  res.render('test');
}); // Маршрут для відображення профілю користувача

app.get('/profil', function _callee3(req, res) {
  var id, user, photo;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log('Користувач переглядає свій профіль');
          _context3.prev = 1;
          id = req.query.id;
          _context3.next = 5;
          return regeneratorRuntime.awrap(db.get('SELECT * FROM users WHERE id = ?', id));

        case 5:
          user = _context3.sent;
          _context3.next = 8;
          return regeneratorRuntime.awrap(db.get('SELECT filename FROM photos WHERE user_id = ? ORDER BY id DESC LIMIT 1', id));

        case 8:
          photo = _context3.sent;

          if (user) {
            res.render('profil', {
              username: user.username,
              email: user.email,
              id: user.id,
              photo: photo ? photo.filename : null
            });
          } else {
            res.status(404).send('Користувача не знайдено');
          }

          _context3.next = 16;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](1);
          console.error('Помилка отримання інформації профілю користувача:', _context3.t0.message);
          res.status(500).send('Помилка отримання інформації профілю користувача');

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 12]]);
});
app.get('/script.js', function (req, res) {
  console.log('Користувач запитує файл script.js');
  res.set('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, '/views/profil/profil_js/script.js'));
});
app.get('/test.js', function (req, res) {
  console.log('Користувач запитує файл test.js');
  res.set('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, '/views/test_english/test.js'));
});
app.get('/perexid.js', function (req, res) {
  console.log('Користувач запитує файл perexid.js');
  res.set('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, '/views/profil/profil_js/perexid.js'));
});
app.get('/test.css', function (req, res) {
  console.log('Користувач запитує файл test.css');
  res.set('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, '/views/test_english/test.css'));
});
app.get('/style.css', function (req, res) {
  console.log('Користувач запитує файл style.css');
  res.set('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, '/views/profil/style.css'));
});
app.get('/prfil.css', function (req, res) {
  console.log('Користувач запитує файл prfil.css');
  res.set('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, '/views/profil/prifil_css/profil.css'));
});
app.get('/img/:filename', function (req, res) {
  var filename = req.params.filename;
  console.log("\u041A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447 \u043F\u0435\u0440\u0435\u0433\u043B\u044F\u0434\u0430\u0454 \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F: ".concat(filename));
  var imagePath = path.join(__dirname, './views/profil/img/', filename);
  res.sendFile(imagePath);
});
app.use('/js', express["static"](path.join(__dirname, 'views')));
app.post('/register', function _callee4(req, res) {
  var _req$body, username, email, password, emailRegex, selectUserSql, user, insertUserSql;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log('Користувач реєструється');
          _context4.prev = 1;
          _req$body = req.body, username = _req$body.username, email = _req$body.email, password = _req$body.password;

          if (!(username.length < 3 || username.length > 20)) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", res.status(400).send('Ім\'я користувача повинно містити від 3 до 20 символів.'));

        case 5:
          emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          if (emailRegex.test(email)) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(400).send('Введіть правильну електронну пошту.'));

        case 8:
          selectUserSql = "SELECT * FROM users WHERE username = ? OR email = ?";
          _context4.next = 11;
          return regeneratorRuntime.awrap(db.get(selectUserSql, [username, email]));

        case 11:
          user = _context4.sent;

          if (!user) {
            _context4.next = 17;
            break;
          }

          console.log('Користувач з таким ім\'ям або електронною поштою вже існує');
          return _context4.abrupt("return", res.status(400).send('Користувач з таким ім\'ям або електронною поштою вже існує.'));

        case 17:
          insertUserSql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
          _context4.next = 20;
          return regeneratorRuntime.awrap(db.run(insertUserSql, [username, email, password]));

        case 20:
          console.log('Дані успішно збережені у базі даних');
          res.send('Реєстрація успішна');

        case 22:
          _context4.next = 28;
          break;

        case 24:
          _context4.prev = 24;
          _context4.t0 = _context4["catch"](1);
          console.error('Помилка обробки реєстрації користувача:', _context4.t0.message);
          res.status(500).send('Помилка обробки реєстрації користувача');

        case 28:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 24]]);
});
app.post('/login', function _callee5(req, res) {
  var _req$body2, username, password, selectUserSql, user;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          console.log('Користувач входить в систему');
          _context5.prev = 1;
          _req$body2 = req.body, username = _req$body2.username, password = _req$body2.password;
          selectUserSql = "SELECT * FROM users WHERE username = ? AND password = ?";
          _context5.next = 6;
          return regeneratorRuntime.awrap(db.get(selectUserSql, [username, password]));

        case 6:
          user = _context5.sent;

          if (user) {
            req.session.userId = user.id;
            console.log('Користувач знайдений:', user);
            res.redirect("/profil?id=".concat(user.id));
          } else {
            console.log('Користувача не знайдено');
            res.redirect('/');
          }

          _context5.next = 14;
          break;

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](1);
          console.error('Помилка обробки входу користувача:', _context5.t0.message);
          res.status(500).send('Помилка обробки входу користувача');

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 10]]);
});
app.post('/logout', function (req, res) {
  console.log('Користувач виходить з системи');
  req.session.destroy(function (err) {
    if (err) {
      console.error('Помилка виходу з акаунту:', err.message);
      return res.status(500).send('Помилка виходу з акаунту');
    }

    res.redirect('/');
  });
});
app.get('/check-login', function (req, res) {
  console.log('Користувач перевіряє статус входу');

  if (req.session.userId) {
    res.json({
      loggedIn: true,
      userId: req.session.userId
    });
  } else {
    res.json({
      loggedIn: false
    });
  }
});
app.listen(port, function () {
  console.log("\u0421\u0435\u0440\u0432\u0435\u0440 \u0437\u0430\u043F\u0443\u0449\u0435\u043D\u0438\u0439 \u043D\u0430 \u043F\u043E\u0440\u0442\u0456 ".concat(port));
});