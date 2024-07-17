const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;
const dbName = 'user.sqlite';

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('golovnaCSS'));

const db = new sqlite3.Database(dbName);

(async () => {
    try {
        const dbExists = await fs.access(dbName);
        if (!dbExists) {
            const usersTableSql = `
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY,
                    username TEXT,
                    email TEXT,
                    password TEXT
                )
            `;
        
            await db.run(usersTableSql);
            console.log('Таблиця "users" успішно створена');
        } else {
            console.log('Файл бази даних вже існує');
        }
    } catch (err) {
        console.error('Помилка створення таблиці "users":', err.message);
    }
})();

app.get('/', (req, res) => {
    res.render('golovna');
});

app.get('/res_log', (req, res) => {
    res.render('reg_log');
});

// Маршрут для відображення профілю користувача
app.get('/profil', (req, res) => {
    const { username, email } = req.query;
    res.render('profil', { username, email });
});

app.get('/script.js', (req, res) => {
    res.set('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, '/views/profil/profil_js/script.js'));
});

app.get('/test.js', (req, res) => {
    res.set('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, '/views/test.js'));
});

app.get('/perexid.js', (req, res) => {
    res.set('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, '/views/profil/profil_js/perexid.js'));
});

app.get('/style.css', (req, res) => {
    res.set('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, '/views/profil/style.css'));
});

app.get('/img/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, './views/profil/img/', filename);
    res.sendFile(imagePath);
});

app.use('/js', express.static(path.join(__dirname, 'views')));

app.post('/register', async (req, res) => {
    try {
        const userData = req.body;

        if (userData.username.length < 3 || userData.username.length > 20) {
            return res.status(400).send('Ім\'я користувача повинно містити від 3 до 20 символів.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            return res.status(400).send('Введіть правильну електронну пошту.');
        }

        const selectUserSql = `
            SELECT * FROM users
            WHERE username = ? OR email = ?
        `;
        const row = await db.get(selectUserSql, [userData.username, userData.email]);

        if (row) {
            return res.status(400).send('Користувач з таким ім\'ям або електронною поштою вже існує.');
        } else {
            const insertUserSql = `
                INSERT INTO users (username, email, password) 
                VALUES (?, ?, ?)
            `;
            await db.run(insertUserSql, [userData.username, userData.email, userData.password]);
            console.log('Дані успішно збережені у базі даних');
            res.send('Реєстрація успішна');
        }
    } catch (error) {
        console.error('Помилка обробки реєстрації користувача:', error.message);
        res.status(500).send('Помилка обробки реєстрації користувача');
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const selectUserSql = `
            SELECT * FROM users
            WHERE username = ? AND password = ?
        `;

        const row = await db.get(selectUserSql, [username, password,id]);

        if (row) {
            console.log('Користувач знайдений:', row);
            // Передаємо дані користувача через параметр запиту при переадресації
            res.redirect(`/profile?username=${row.username}&email=${row.email}&id=${row.id}`);
        } else {
            console.log('Користувача не знайдено');
            res.redirect('/');
        }
    } catch (error) {
        console.error('Помилка обробки входу користувача:', error.message);
        res.status(500).send('Помилка обробки входу користувача');
    }
});

app.listen(port, () => {
    console.log(`Сервер запущений на порті ${port}`);
});
