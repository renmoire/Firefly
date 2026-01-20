const character = document.querySelector("#char");
const voicebt = document.querySelector("#voicebt");
const slides = document.querySelectorAll(".frame");
const scrolltext = document.querySelector(".scroll-indicator");
const cards = document.querySelectorAll(".cardind");
const prevbt = document.getElementById("prevbtn");
const nextbt = document.getElementById("nextbtn");
const pageinfo = document.getElementById("pageinfo");

let current = 0;

window.addEventListener("load", () => {
    character.classList.add("fade");

    setInterval(() => {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
    }, 2500)
});


let currentpage = 1;
const itemsperpage = 3;
const totalpages = Math.ceil(cards.length / itemsperpage);

function showpage(page) {
    const start = (page - 1) * itemsperpage;
    const end = start + itemsperpage;

    cards.forEach((card, index) => {
        card.style.display =
        index >= start && index < end ? "flex" : "none";
    });

    pageinfo.textContent = `${page} / ${totalpages}`;
    prevbt.disabled = page === 1;
    nextbt.disabled = page === totalpages;
}

prevbt.addEventListener("click", () => {
    if (currentpage > 1) {
        currentpage--;
        showpage(currentpage);
  }
});

nextbt.addEventListener("click", () => {
    if (currentpage < totalpages) {
        currentpage++;
        showpage(currentpage);
  }
});

// init
showpage(currentpage);