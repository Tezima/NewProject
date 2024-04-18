"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var sqlite3 = require('sqlite3').verbose();

var dbName = 'later.sqlite';
var db = new sqlite3.Database(dbName);
db.serialize(function () {
  var usersTableSql = "\n        CREATE TABLE IF NOT EXISTS users (\n            id INTEGER PRIMARY KEY,\n            username TEXT,\n            email TEXT,\n            password TEXT\n        )\n    ";
  db.run(usersTableSql, function (err) {
    if (err) {
      return console.error('Помилка створення таблиці "users":', err.message);
    }

    console.log('Таблиця "users" успішно створена');
  });
});

var User =
/*#__PURE__*/
function () {
  function User() {
    _classCallCheck(this, User);
  }

  _createClass(User, null, [{
    key: "all",
    value: function all(cb) {
      db.all('SELECT * FROM users', cb);
    }
  }, {
    key: "find",
    value: function find(id, cb) {
      db.get('SELECT * FROM users WHERE id = ?', id, cb);
    }
  }, {
    key: "create",
    value: function create(data, cb) {
      var sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.run(sql, [data.username, data.email, data.password], cb);
    }
  }, {
    key: "delete",
    value: function _delete(id, cb) {
      if (!id) return cb(new Error('Уведіть Id'));
      db.run('DELETE FROM users WHERE id = ?', id, cb);
    }
  }]);

  return User;
}();

module.exports.User = User;