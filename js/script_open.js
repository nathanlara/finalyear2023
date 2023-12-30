function createOpenQuestion(question) {
    var container = document.createElement('div');
    container.className = 'question-container mb-3';

    var label = document.createElement('label');
    label.textContent = question.question;
    container.appendChild(label);

    var textarea = document.createElement('textarea');
    textarea.className = 'form-control';
    textarea.rows = 4;
    container.appendChild(textarea);

    return container;
}

function loadOpenQuestions() {
    fetch('../files/quest_learn_open.json')
        .then(response => response.json())
        .then(data => {
            var questionsDiv = document.getElementById('questions');
            var currentTheme = '';

            data.questions.forEach(function(question) {
                if (question.type === 'open-ended') {
                    if (question.theme !== currentTheme) {
                        currentTheme = question.theme;
                        var themeHeader = document.createElement('h3');
                        themeHeader.textContent = currentTheme;
                        themeHeader.className = 'fw-bold mt-4 mb-4';
                        questionsDiv.appendChild(themeHeader);
                    }
                    questionsDiv.appendChild(createOpenQuestion(question));
                }
            });
        })
        .catch(error => console.error('Error loading questions:', error));
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const logoImg = '../img/logo.png'; 
    doc.addImage(logoImg, 'PNG', 10, 10, 10, 10); // Ajuste as dimensões conforme necessário

    let y = 35; // Iniciar a escrita do texto abaixo do logotipo

    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(10, y, 'Refletindo sobre o Fim do Ano e abrindo caminho para muito mais.'); // Ajuste a posição conforme necessário
    y += 10;

    document.querySelectorAll('.question-container').forEach(function (container, index) {
        let question = container.querySelector('label').innerText;
        let answer = container.querySelector('textarea').value;

        // Adicionar a pergunta
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(10, y, (index + 1) + ". " + question);
        y += 10;

        // Adicionar a resposta
        doc.setFont(undefined, 'normal');
        const lines = doc.splitTextToSize(answer, 180); // Quebra o texto em várias linhas
        doc.text(10, y, lines);
        y += lines.length * 7 + 10; // Ajuste a altura Y para a próxima pergunta

        // Verifica se é necessário adicionar uma nova página
        if (y > 280) {
            doc.addPage();
            y = 10; // Reseta a posição Y para o topo da nova página
        }
    });

    // Salva o PDF
    doc.save('questionario-respostas.pdf');
}



// Load open questions on page load
window.onload = loadOpenQuestions;
