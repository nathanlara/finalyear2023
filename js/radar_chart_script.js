document.addEventListener('DOMContentLoaded', function() {
    const answers = JSON.parse(localStorage.getItem('surveyResults'));

    console.log(answers)

    const likertMapping = {
        'Discordo Totalmente': 0,
        'Discordo': 1,
        'Neutro': 2,
        'Concordo': 3,
        'Concordo Totalmente': 4
    };

    // Array de perguntas - substitua isso pelo seu array real de perguntas
    const questionsList = [
        // ... suas perguntas com 'theme', 'id', etc. ...
    ];

    // Criar um mapeamento de ID de pergunta para tema
    const questionThemes = questionsList.reduce((acc, question) => {
        acc[question.id] = question.theme;
        return acc;
    }, {});

    var scoresByTheme = {};
    var questionCountsByTheme = {};

    for (const questionId in answers) {
        const response = answers[questionId];
        const theme = questionThemes[questionId];
        const score = likertMapping[response];

        if (!theme || score === undefined) {
            console.error('Tema ou resposta não encontrados para a pergunta:', questionId);
            continue;
        }

        if (!scoresByTheme[theme]) {
            scoresByTheme[theme] = 0;
            questionCountsByTheme[theme] = 0;
        }

        scoresByTheme[theme] += score;
        questionCountsByTheme[theme]++;
    }

    const themes = Object.keys(scoresByTheme);
    const dataPoints = themes.map(theme => {
        const average = scoresByTheme[theme] / questionCountsByTheme[theme] / 4; // Normalizando a média
        return average;
    });

    const ctx = document.getElementById('radarChart').getContext('2d');
    const radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: themes,
            datasets: [{
                label: 'Resultado do Questionário',
                data: dataPoints,
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)'
            }]
        },
        options: {
            scale: {
                ticks: { beginAtZero: true, max: 1 }
            }
        }
    });
});


