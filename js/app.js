/* =========================
   🔥 GLOBAL LOADER SYSTEM
========================= */

let progress = 0;
let interval = null;

function startLoader(){

    progress = 0;
    updateLoader();

    clearInterval(interval);

    interval = setInterval(() => {

        if (progress < 85) {
            progress += Math.random() * 10; // fake progress feel
            updateLoader();
        }

    }, 200);
}

function stopLoader(){

    clearInterval(interval);

    progress = 100;
    updateLoader();

    setTimeout(() => {
        progress = 0;
        updateLoader();
    }, 500);
}

function updateLoader(){

    const bar = document.getElementById("loaderFill");
    const text = document.getElementById("loaderText");

    if (!bar || !text) return;

    bar.style.width = progress + "%";
    text.innerText = Math.floor(progress) + "%";
}

/* =========================
   🔥 AUTO HOOKS
========================= */

// App start
window.addEventListener("load", () => {
    startLoader();

    // simulate load completion
    setTimeout(() => {
        stopLoader();
    }, 800);
});

/* =========================
   🔥 OPTIONAL GLOBAL USE
========================= */

window.startLoader = startLoader;
window.stopLoader = stopLoader;