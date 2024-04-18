"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var app = express();
var port = 3000; // Ви можете вибрати будь-який порт, який вам подобається
// Дозволяємо обробку форми з допомогою body-parser

app.use(bodyParser.urlencoded({
  extended: true
})); // Маршрут для обробки POST-запиту форми

app.post('/register', function (req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password; // Тут ви можете зробити будь-яку логіку, що вам потрібна, для обробки даних

  console.log('Received data:', name, email, password); // Відповідь на клієнтський браузер

  res.send('Registration successful!');
}); // Запускаємо сервер

app.listen(port, function () {
  console.log("Server is running on port ".concat(port));
});