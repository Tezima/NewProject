const sqlite3 = require('sqlite3').verbose();
const dbName = 'later.sqlite';
const db = new sqlite3.Database(dbName);

db.serialize(() => {
    const usersTableSql = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT,
            email TEXT,
            password TEXT
        )
    `;

    db.run(usersTableSql, (err) => {
        if (err) {
            return console.error('Помилка створення таблиці "users":', err.message);
        }
        console.log('Таблиця "users" успішно створена');
    });
});

class User {
    static all(cb) {
        db.all('SELECT * FROM users', cb);
    }

    static find(id, cb) {
        db.get('SELECT * FROM users WHERE id = ?', id, cb);
    }

    static create(data, cb) {
        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.run(sql, [data.username, data.email, data.password], cb);
    }

    static delete(id, cb) {
        if (!id) return cb(new Error('Уведіть Id'));
        db.run('DELETE FROM users WHERE id = ?', id, cb);
    }
}

module.exports.User = User;
