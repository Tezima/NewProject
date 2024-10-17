function checkAnswers() {
    const form = document.getElementById('quizForm');
    const resultDiv = document.getElementById('result');
    let score = 0;
    const totalQuestions = 2;
    const incorrectAnswers = [];

    const q1Answer = form.querySelector('input[name="question1"]:checked');
    if (q1Answer && q1Answer.value === 'correct') {
        score++;
    } else if (q1Answer) {
        incorrectAnswers.push(q1Answer.id);
    }

    const q2Answer = form.querySelector('input[name="question2"]:checked');
    if (q2Answer && q2Answer.value === 'correct') {
        score++;
    } else if (q2Answer) {
        incorrectAnswers.push(q2Answer.id);
    }

    if (score === 0) {
        resultDiv.textContent = `Ви не відповіли правильно на жодне питання.`;
        resultDiv.className = 'result incorrect';
    } else {
        resultDiv.textContent = `Ви відповіли правильно на ${score} з ${totalQuestions} питань.`;
        resultDiv.className = 'result correct';
    }

    incorrectAnswers.forEach(answerId => {
        const label = form.querySelector(`label[for="${answerId}"]`);
        if (label) {
            label.style.color = 'red';
        }
    });
}

function resetQuiz() {
    const form = document.getElementById('quizForm');
    form.reset();
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = '';
    resultDiv.className = 'result';

    const labels = form.querySelectorAll('label');
    labels.forEach(label => {
        label.style.color = '';
    });
}

function toggleQuiz() {
    const quizContent = document.querySelector('.quiz-content');
    const toggleButton = document.querySelector('.toggle-button');

    if (quizContent.style.display === 'none') {
        quizContent.style.display = 'block';
        toggleButton.textContent = 'Згорнути тест';
    } else {
        quizContent.style.display = 'none';
        toggleButton.textContent = 'Розгорнути тест';
    }
}
function checkAnswers() {
    const quizForm = document.getElementById('quizForm');
    const formData = new FormData(quizForm);
    let score = 0;

    for (let entry of formData.entries()) {
        if (entry[1] === 'correct') {
            score++;
        }
    }

    fetch('/save-test-result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ score })
    }).then(response => {
        if (response.ok) {
            document.getElementById('result').textContent = `Ваш результат: ${score}`;
        } else {
            alert('Помилка збереження результатів тесту');
        }
    });
}
