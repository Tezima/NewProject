const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express(); 
const port = 4000;
const dbName = 'user.sqlite';

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('golovnaCSS'));

const db = new sqlite3.Database(dbName);

db.serialize(async () => {
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
});

app.get('/', (req, res) => {
    res.render('golovna');
});

app.get('/res_log', (req, res) => {
    res.render('reg_log');
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

app.get('/golovnaCSS/picturegolovna/')

app.get('/img/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, './views/profil/img/', filename);
    res.sendFile(imagePath);
});

app.use('/js', express.static(path.join(__dirname, 'views')));

app.post('/register', async (req, res) => {
    const userData = req.body;

    const insertUserSql = `
        INSERT INTO users (username, email, password) 
        VALUES (?, ?, ?)
    `;

    try {
        await db.run(insertUserSql, [userData.username, userData.email, userData.password]);
        console.log('Дані успішно збережені у базі даних');
        res.send('Реєстрація успішна');
    } catch (err) {
        console.error('Помилка збереження даних:', err);
        res.status(500).send('Помилка збереження даних');
    }
});

app.listen(port, () => {
    console.log(`Сервер запущений на порті ${port}`);
});
