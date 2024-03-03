window.addEventListener("scroll", function() {
    console.log("Scrolling..."); // Apenas para debug
    var header = document.querySelector(".navbar");
    header.classList.toggle("scrolled", window.scrollY > 0);
});




