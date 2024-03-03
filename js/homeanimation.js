document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];

    function Particle(x, y, radius, color) {
        this.originalX = x;
        this.originalY = y;
        this.radius = radius;
        this.color = color;
        this.angle = Math.random() * Math.PI * 2; // Ângulo aleatório para o movimento
        this.movementRadius = Math.random() * 5; // Raio de movimento

        this.draw = () => {
            this.angle += 0.01; // Velocidade da oscilação
            this.x = this.originalX + Math.cos(this.angle) * this.movementRadius;
            this.y = this.originalY + Math.sin(this.angle) * this.movementRadius;

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        };
    }

    function init() {
        particles.length = 0;
        const numberOfParticles = 1000;
        const colorPalette = ['#69D2E7', '#081F5C', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423', '#081F5C'];

        for (let i = 0; i < numberOfParticles; i++) {
            const canvasCenterX = canvas.width / 2;
            const canvasCenterY = canvas.height / 2;
            const particleRadius = Math.random() * 5;
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];

            const angle = Math.random() * Math.PI * 2;
            const radius = 50 + Math.random() * (canvas.width / 4);
            const x = canvasCenterX + radius * Math.sin(angle);
            const y = canvasCenterY + radius * Math.cos(angle);

            particles.push(new Particle(x, y, particleRadius, color));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].draw();
        }
    }

    init();
    animate();
});




