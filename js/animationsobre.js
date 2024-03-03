const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fadeInUp');
            // Opcional: se você quiser que a animação ocorra apenas uma vez, descomente a linha abaixo
            // observer.unobserve(entry.target);
        } else {
            // Remova a classe para redefinir a animação
            entry.target.classList.remove('fadeInUp');
        }
    });
}, { threshold: 0.1 }); // Threshold de 10%

// Selecionar todos os elementos que devem ser animados
document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
});