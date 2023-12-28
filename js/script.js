function createLikertOption(question, option) {
    var optionDiv = document.createElement('div');
    optionDiv.className = 'form-check';

    var checkbox = document.createElement('input');
    checkbox.type = 'radio';
    checkbox.className = 'form-check-input';
    checkbox.id = question.question + '_' + option;
    checkbox.name = question.question;
    checkbox.value = option;

    var label = document.createElement('label');
    label.className = 'form-check-label';
    label.htmlFor = question.question + '_' + option;
    label.textContent = option;

    optionDiv.appendChild(checkbox);
    optionDiv.appendChild(label);

    return optionDiv;
}

function createQuestion(question) {
    var container = document.createElement('div');
    container.className = 'question-container mb-3';
    var label = document.createElement('label');
    label.textContent = question.question;
    container.appendChild(label);

    if (question.type === 'open-ended') {
        var textarea = document.createElement('textarea');
        textarea.className = 'form-control';
        textarea.rows = 6;
        container.appendChild(textarea);
    } else if (question.type === 'likert') {
        var scale = ['Discordo Totalmente', 'Discordo', 'Neutro', 'Concordo', 'Concordo Totalmente'];
        var likertContainer = document.createElement('div');
        likertContainer.className = 'mt-2';
        scale.forEach(function(option) {
            likertContainer.appendChild(createLikertOption(question, option));
        });
        container.appendChild(likertContainer);
    }

    return container;
}

function loadQuestions() {
    fetch('translated_questions.json')
        .then(response => response.json())
        .then(data => {
            var questionsDiv = document.getElementById('questions');
            var currentTheme = '';
            data.questions.forEach(function(question) {
                // Check if the theme has changed
                if (question.theme !== currentTheme) {
                    currentTheme = question.theme;
                    var themeHeader = document.createElement('h3');
                    themeHeader.textContent = currentTheme;
                    themeHeader.className = 'mt-4 mb-2';
                    questionsDiv.appendChild(themeHeader);
                }
                questionsDiv.appendChild(createQuestion(question));
            });
        })
        .catch(error => console.error('Error loading questions:', error));
}

// Load questions on page load
window.onload = loadQuestions;