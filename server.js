const express = require('express');
const http = require('http');
const fs = require('fs');

const app = express();

app.set('view engine', 'ejs'); // Виправлено опечатку 'viev engine' на 'view engine'
app.use(express.static('golovnaCSS')); // Встановлення статичного каталогу для CSS файлів

// Підключення middleware для обробки даних POST-запитів
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.render('golovna'); // Відображення сторінки 'golovna'
});

// Обробник POST-запиту для шляху '/check-user'
app.post('/check-user', (req, res) => {
   let username =req.body.username
   if(username=="")
        return res.redirect('/')
});

// // Зверніть увагу, що цей обробник маршруту ("/") замінений, оскільки обробник вище вже відповідає на кореневий шлях
// app.get('/home', (req, res) => {
//     res.send('home'); // Відправлення тексту "home" на шлях '/home'
// });

const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Сервер запущений: http://localhost:${PORT}`);
});

// let server = http.createServer((req,res)=>{
//     res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'})
//     // res.end('')

//     if(req.url =='/')
//         fs.createReadStream('./golovna.html').pipe(res)
//     // else if(req.url=='/about')
//     //     fs.createReadStream('./golovna.html').pipe(res)

// })

// const PORT = 4000
// const HOST ='localhost'

// server.listen(PORT,HOST,()=>{
//     console.log(`Сервер запущений://${HOST}:${PORT}`)
// })
