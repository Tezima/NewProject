"use strict";

// function redirect() {
//     fetch('/check-session')
//         .then(response => response.json())
//         .then(data => {
//             if (data.loggedIn) {
//                 window.location.href = '/profil';
//             } else {
//                 window.location.href = '/res_log';
//             }
//         })
//         .catch(error => {
//             console.error('Помилка перевірки сесії:', error);
//             window.location.href = '/res_log';
//         });
// }
function redirect() {
  // Замініть 'нова_сторінка.html' на URL сторінки, на яку ви хочете перейти
  window.location.href = '/res_log';
}