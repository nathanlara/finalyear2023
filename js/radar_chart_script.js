document.addEventListener('DOMContentLoaded', function() {
    const answers = JSON.parse(localStorage.getItem('surveyResults'));

    // Definição de likertMapping
    const likertMapping = {
        'Discordo Totalmente': 0,
        'Discordo': 1,
        'Neutro': 2,
        'Concordo': 3,
        'Concordo Totalmente': 4
    };

    fetch('../files/quest_learn_likert.json') // Caminho para o arquivo JSON com as perguntas
        .then(response => response.json())
        .then(data => {
            const questionsList = data.questions;

            // Mapear ID da pergunta para o tema
            const questionThemes = questionsList.reduce((acc, question) => {
                acc[question.id] = question.theme;
                return acc;
            }, {});

            let scoresByTheme = {};
            let questionCountsByTheme = {};

            answers.forEach(answer => {
                const theme = questionThemes[answer.id];
                const score = likertMapping[answer.response];

                if (!theme || score === undefined) {
                    console.error('Tema ou resposta não encontrados para a pergunta:', answer.id);
                    return;
                }

                if (!scoresByTheme[theme]) {
                    scoresByTheme[theme] = 0;
                    questionCountsByTheme[theme] = 0;
                }

                scoresByTheme[theme] += score;
                questionCountsByTheme[theme]++;
            });

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
                        label: 'Meu Círculo da Vida em 2023',
                        data: dataPoints,
                        fill: true,
                        backgroundColor: 'rgba(135, 206, 235, 0.2)',
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
        })
        .catch(error => console.error('Error loading questions:', error));
});

function generatePDF() {
    html2canvas(document.querySelector("#radarChart")).then(canvas => {
        const radarImgData = canvas.toDataURL('image/png');

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const logoImg = '../img/logo.png'; 
        // Adicionar o logotipo: Certifique-se de que o caminho da imagem está correto
        doc.addImage(logoImg, 'PNG', 10, 10, 10, 10);

        let y = 35; // Ajustar conforme a posição do logotipo

        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text(10, y, 'Refletindo sobre o Gráfico de Radar');
        y += 10;

        // Adicionar o gráfico de radar
        doc.addImage(radarImgData, 'PNG', 10, y, 180, 180); 
        y += 110; 
        
        doc.save('resultado-grafico-radar.pdf');
    }).catch(error => {
        console.error('Erro ao gerar o PDF:', error);
    });
}






