const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');
const multer = require('multer');
const session = require('express-session');

const app = express();
const port = 8080;
const dbName = 'user.sqlite';

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('golovnaCSS'));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

// Middleware для логування IP-адреси користувача
app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`IP-адреса користувача: ${ip}`);
    next();
});

let db;

// Ініціалізація бази даних
(async () => {
    try {
        db = await sqlite.open({
            filename: dbName,
            driver: sqlite3.Database
        });

        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                username TEXT,
                email TEXT,
                password TEXT
            )
        `);

        await db.exec(`
            CREATE TABLE IF NOT EXISTS photos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                filename TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        console.log('Таблиці "users" та "photos" успішно створені або вже існують');
    } catch (err) {
        console.error('Помилка створення таблиць:', err.message);
    }
})();

// Налаштування multer для завантаження фотографій
const upload = multer({ dest: 'uploads/' });

// Маршрут для завантаження фото
app.post('/upload', upload.single('photo'), async (req, res) => {
    console.log('Користувач завантажує фото');
    try {
        const { filename } = req.file;
        const userId = req.query.id;

        // Перевірка наявності фото у користувача
        const existingPhoto = await db.get('SELECT filename FROM photos WHERE user_id = ?', userId);

        if (existingPhoto) {
            console.log('Фото вже завантажено');
            res.status(400).send('Фото вже завантажено.');
        } else {
            await db.run('INSERT INTO photos (user_id, filename) VALUES (?, ?)', [userId, filename]);
            console.log('Фотографія успішно завантажена');
            res.status(200).send('Фотографія успішно завантажена');
        }
    } catch (error) {
        console.error('Помилка завантаження фотографії:', error.message);
        res.status(500).send('Помилка завантаження фотографії');
    }
});

// Маршрут для відображення фото
app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    console.log(`Користувач переглядає фото: ${filename}`);
    res.sendFile(path.join(__dirname, './uploads/', filename));
});

app.get('/', (req, res) => {
    console.log('Користувач відвідує головну сторінку');
    res.render('golovna');
});

app.get('/res_log', (req, res) => {
    console.log('Користувач переходить на сторінку реєстрації/входу');
    res.render('reg_log');
});

app.get('/test', (req, res) => {
    console.log('Користувач переходить на сторінку тести');
    res.render('test');
});

// Маршрут для відображення профілю користувача
app.get('/profil', async (req, res) => {
    console.log('Користувач переглядає свій профіль');
    try {
        const id = req.query.id;
        const user = await db.get('SELECT * FROM users WHERE id = ?', id);
        const photo = await db.get('SELECT filename FROM photos WHERE user_id = ? ORDER BY id DESC LIMIT 1', id);

        if (user) {
            res.render('profil', { username: user.username, email: user.email, id: user.id, photo: photo ? photo.filename : null });
        } else {
            res.status(404).send('Користувача не знайдено');
        }
    } catch (error) {
        console.error('Помилка отримання інформації профілю користувача:', error.message);
        res.status(500).send('Помилка отримання інформації профілю користувача');
    }
});

app.get('/script.js', (req, res) => {
    console.log('Користувач запитує файл script.js');
    res.set('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, '/views/profil/profil_js/script.js'));
});

app.get('/test.js', (req, res) => {
    console.log('Користувач запитує файл test.js');
    res.set('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, '/views/test_english/test.js'));
});

app.get('/perexid.js', (req, res) => {
    console.log('Користувач запитує файл perexid.js');
    res.set('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, '/views/profil/profil_js/perexid.js'));
});

app.get('/test.css', (req, res) => {
    console.log('Користувач запитує файл test.css');
    res.set('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, '/views/test_english/test.css'));
});

app.get('/style.css', (req, res) => {
    console.log('Користувач запитує файл style.css');
    res.set('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, '/views/profil/style.css'));
});

app.get('/prfil.css', (req, res) => {
    console.log('Користувач запитує файл prfil.css');
    res.set('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, '/views/profil/prifil_css/profil.css'));
});

app.get('/img/:filename', (req, res) => {
    const filename = req.params.filename;
    console.log(`Користувач переглядає зображення: ${filename}`);
    const imagePath = path.join(__dirname, './views/profil/img/', filename);
    res.sendFile(imagePath);
});

app.use('/js', express.static(path.join(__dirname, 'views')));

app.post('/register', async (req, res) => {
    console.log('Користувач реєструється');
    try {
        const { username, email, password } = req.body;

        if (username.length < 3 || username.length > 20) {
            return res.status(400).send('Ім\'я користувача повинно містити від 3 до 20 символів.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send('Введіть правильну електронну пошту.');
        }

        const selectUserSql = `SELECT * FROM users WHERE username = ? OR email = ?`;
        const user = await db.get(selectUserSql, [username, email]);

        if (user) {
            console.log('Користувач з таким ім\'ям або електронною поштою вже існує');
            return res.status(400).send('Користувач з таким ім\'ям або електронною поштою вже існує.');
        } else {
            const insertUserSql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
            await db.run(insertUserSql, [username, email, password]);
            console.log('Дані успішно збережені у базі даних');
            res.send('Реєстрація успішна');
        }
    } catch (error) {
        console.error('Помилка обробки реєстрації користувача:', error.message);
        res.status(500).send('Помилка обробки реєстрації користувача');
    }
});

app.post('/login', async (req, res) => {
    console.log('Користувач входить в систему');
    try {
        const { username, password } = req.body;

        const selectUserSql = `SELECT * FROM users WHERE username = ? AND password = ?`;
        const user = await db.get(selectUserSql, [username, password]);

        if (user) {
            req.session.userId = user.id;
            console.log('Користувач знайдений:', user);
            res.redirect(`/profil?id=${user.id}`);
        } else {
            console.log('Користувача не знайдено');
            res.redirect('/');
        }
    } catch (error) {
        console.error('Помилка обробки входу користувача:', error.message);
        res.status(500).send('Помилка обробки входу користувача');
    }
});

app.post('/logout', (req, res) => {
    console.log('Користувач виходить з системи');
    req.session.destroy(err => {
        if (err) {
            console.error('Помилка виходу з акаунту:', err.message);
            return res.status(500).send('Помилка виходу з акаунту');
        }
        res.redirect('/');
    });
});

app.get('/check-login', (req, res) => {
    console.log('Користувач перевіряє статус входу');
    if (req.session.userId) {
        res.json({ loggedIn: true, userId: req.session.userId });
    } else {
        res.json({ loggedIn: false });
    }
});

app.listen(port, () => {
    console.log(`Сервер запущений на порті ${port}`);
});
