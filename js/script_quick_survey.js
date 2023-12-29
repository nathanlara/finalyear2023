function createLikertQuestion(question) {
    var container = document.createElement('div');
    container.className = 'question-container mb-3';
    container.setAttribute('data-theme', question.theme); // Define o tema da pergunta

    var label = document.createElement('label');
    label.textContent = question.question;
    container.appendChild(label);

    var scale = ['Discordo Totalmente', 'Discordo', 'Neutro', 'Concordo', 'Concordo Totalmente'];
    var likertContainer = document.createElement('div');
    likertContainer.className = 'mt-2';
    scale.forEach(function(option) {
        likertContainer.appendChild(createLikertOption(question.id, option)); // Passando o ID da pergunta para a função de opção
    });
    container.appendChild(likertContainer);

    return container;
}

function createLikertOption(questionId, option) {
    var optionDiv = document.createElement('div');
    optionDiv.className = 'form-check';

    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.className = 'form-check-input';
    radio.id = questionId + '_' + option;
    radio.name = questionId; // Agrupa os botões de rádio pelo ID da pergunta
    radio.value = option;

    var label = document.createElement('label');
    label.className = 'form-check-label';
    label.htmlFor = radio.id;
    label.textContent = option;

    optionDiv.appendChild(radio);
    optionDiv.appendChild(label);

    return optionDiv;
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
    var answers = [];
    document.querySelectorAll('.question-container').forEach(function (container) {
        var selectedRadio = container.querySelector('input[type="radio"]:checked');
        if (selectedRadio) {
            var questionId = selectedRadio.name;
            var answerValue = selectedRadio.value;
            var questionTheme = container.getAttribute('data-theme'); // Coletando o tema

            answers.push({
                id: questionId,
                response: answerValue,
                theme: questionTheme // Tema incluso nas respostas
            });
        }
    });
    processAndRedirect(answers);
});

function processAndRedirect(answers) {
    localStorage.setItem('surveyResults', JSON.stringify(answers));
    window.location.href = 'radar-chart.html';
}

// Load Likert questions on page load
window.onload = loadLikertQuestions;

