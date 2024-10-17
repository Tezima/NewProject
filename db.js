const sqlite3 = require('sqlite3').verbose();
const dbName = 'later.sqlite';
const db = new sqlite3.Database(dbName);

db.serialize(() => {
    // Створення таблиці користувачів
    const usersTableSql = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT,
            email TEXT,
            password TEXT
        )
    `;

    // Створення таблиці для фотографій користувачів
    const photosTableSql = `
        CREATE TABLE IF NOT EXISTS photos (
            id INTEGER PRIMARY KEY,
            user_id INTEGER,
            photo_data BLOB,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `;

    db.run(usersTableSql, (err) => {
        if (err) {
            return console.error('Помилка створення таблиці "users":', err.message);
        }
        console.log('Таблиця "users" успішно створена');
    });

    db.run(photosTableSql, (err) => {
        if (err) {
            return console.error('Помилка створення таблиці "photos":', err.message);
        }
        console.log('Таблиця "photos" успішно створена');
    });
});

class User {
    // Решта методів класу User
}

module.exports.User = User;
