document.addEventListener('DOMContentLoaded', function() {
    var answers = JSON.parse(localStorage.getItem('surveyResults'));
    console.log("Respostas carregadas:", answers);

    const likertMapping = {
        'Discordo Totalmente': 0,
        'Discordo': 1,
        'Neutro': 2,
        'Concordo': 3,
        'Concordo Totalmente': 4
    };

    var scoresByTheme = {};
    var questionCountsByTheme = {};

    for (var questionId in answers) {
        var theme = questionId.split('_')[0];
        var score = likertMapping[answers[questionId]];

        if (score === undefined) {
            console.error('Resposta Likert não mapeada encontrada:', answers[questionId]);
            continue;
        }

        if (!scoresByTheme[theme]) {
            scoresByTheme[theme] = 0;
            questionCountsByTheme[theme] = 0;
        }

        scoresByTheme[theme] += score;
        questionCountsByTheme[theme]++;
    }

    console.log("scoresByTheme", scoresByTheme)

    var dataPoints = [];
    var themes = Object.keys(scoresByTheme);
    
    themes.forEach(theme => {
        var average = scoresByTheme[theme] / questionCountsByTheme[theme] / 4; // Normalizando para a escala de 0 a 1
        dataPoints.push(average);
    });

    var ctx = document.getElementById('radarChart').getContext('2d');
    var radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: themes,
            datasets: [{
                label: 'Resultado do Questionário',
                data: dataPoints,
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scale: {
                ticks: {
                    beginAtZero: true,
                    max: 1
                }
            }
        }
    });
});
