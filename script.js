const character = document.querySelector("#char");
const voicebt = document.querySelector("#voicebt");
const slides = document.querySelectorAll(".frame");
const scrolltext = document.querySelector(".scroll-indicator");

let current = 0;

window.addEventListener("load", () => {
    character.classList.add("fade");

    setInterval(() => {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
    }, 3000)
});
