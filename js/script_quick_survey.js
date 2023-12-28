function createLikertOption(question, option) {
    var optionDiv = document.createElement('div');
    optionDiv.className = 'form-check';

    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.className = 'form-check-input';
    radio.id = question.id + '_' + option;
    radio.name = 'answer_' + question.id; // Assegura que cada pergunta tem um grupo único
    radio.value = option;

    var label = document.createElement('label');
    label.className = 'form-check-label';
    label.htmlFor = radio.id;
    label.textContent = option;

    optionDiv.appendChild(radio);
    optionDiv.appendChild(label);

    return optionDiv;
}


function createLikertQuestion(question) {
    var container = document.createElement('div');
    container.className = 'question-container mb-3';

    var label = document.createElement('label');
    label.textContent = question.question;
    container.appendChild(label);

    var scale = ['Discordo Totalmente', 'Discordo', 'Neutro', 'Concordo', 'Concordo Totalmente'];
    var likertContainer = document.createElement('div');
    likertContainer.className = 'mt-2';
    scale.forEach(function(option) {
        likertContainer.appendChild(createLikertOption(question, option));
    });
    container.appendChild(likertContainer);

    return container;
}

function loadLikertQuestions() {
    fetch('../files/modified_translated_questions.json') // Ajuste o caminho para o seu arquivo JSON
        .then(response => response.json())
        .then(data => {
            var questionsDiv = document.getElementById('likert-questions');
            var currentTheme = '';

            data.questions.forEach(function(question) {
                if (question.type === 'likert') {
                    // Verifica se o tema mudou
                    if (question.theme !== currentTheme) {
                        currentTheme = question.theme;
                        var themeHeader = document.createElement('h3');
                        themeHeader.textContent = currentTheme;
                        themeHeader.className = 'mt-4 mb-2 theme-header';
                        questionsDiv.appendChild(themeHeader);
                    }
                    questionsDiv.appendChild(createLikertQuestion(question));
                }
            });
        })
        .catch(error => console.error('Error loading questions:', error));
}

document.getElementById('submit-button').addEventListener('click', function() {
    var answers = {};
    document.querySelectorAll('.question-container').forEach(function (container) {
        var selectedRadio = container.querySelector('input[type="radio"]:checked');
        if (selectedRadio) {
            var questionId = selectedRadio.name;
            var answerValue = selectedRadio.value;
            answers[questionId] = answerValue;
        }
    });
    processAndRedirect(answers);
});

function processAndRedirect(answers) {
    localStorage.setItem('surveyResults', JSON.stringify(answers));
    window.location.href = 'pages/radar-chart.html';
}


// Load Likert questions on page load
window.onload = loadLikertQuestions;

