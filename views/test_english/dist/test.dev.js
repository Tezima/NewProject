"use strict";

function checkAnswers() {
  var form = document.getElementById('quizForm');
  var resultDiv = document.getElementById('result');
  var score = 0;
  var totalQuestions = 2;
  var incorrectAnswers = [];
  var q1Answer = form.querySelector('input[name="question1"]:checked');

  if (q1Answer && q1Answer.value === 'correct') {
    score++;
  } else if (q1Answer) {
    incorrectAnswers.push(q1Answer.id);
  }

  var q2Answer = form.querySelector('input[name="question2"]:checked');

  if (q2Answer && q2Answer.value === 'correct') {
    score++;
  } else if (q2Answer) {
    incorrectAnswers.push(q2Answer.id);
  }

  if (score === 0) {
    resultDiv.textContent = "\u0412\u0438 \u043D\u0435 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u043B\u0438 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E \u043D\u0430 \u0436\u043E\u0434\u043D\u0435 \u043F\u0438\u0442\u0430\u043D\u043D\u044F.";
    resultDiv.className = 'result incorrect';
  } else {
    resultDiv.textContent = "\u0412\u0438 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u043B\u0438 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E \u043D\u0430 ".concat(score, " \u0437 ").concat(totalQuestions, " \u043F\u0438\u0442\u0430\u043D\u044C.");
    resultDiv.className = 'result correct';
  }

  incorrectAnswers.forEach(function (answerId) {
    var label = form.querySelector("label[for=\"".concat(answerId, "\"]"));

    if (label) {
      label.style.color = 'red';
    }
  });
}

function resetQuiz() {
  var form = document.getElementById('quizForm');
  form.reset();
  var resultDiv = document.getElementById('result');
  resultDiv.textContent = '';
  resultDiv.className = 'result';
  var labels = form.querySelectorAll('label');
  labels.forEach(function (label) {
    label.style.color = '';
  });
}

function toggleQuiz() {
  var quizContent = document.querySelector('.quiz-content');
  var toggleButton = document.querySelector('.toggle-button');

  if (quizContent.style.display === 'none') {
    quizContent.style.display = 'block';
    toggleButton.textContent = 'Згорнути тест';
  } else {
    quizContent.style.display = 'none';
    toggleButton.textContent = 'Розгорнути тест';
  }
}