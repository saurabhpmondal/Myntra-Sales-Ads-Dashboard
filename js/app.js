/* =========================
   🔥 GLOBAL LOADER (SAFE)
========================= */

let progress = 0;
let interval = null;

function createLoader(){

    if (document.getElementById("loaderBar")) return;

    const bar = document.createElement("div");
    bar.id = "loaderBar";

    const fill = document.createElement("div");
    fill.id = "loaderFill";

    const text = document.createElement("div");
    text.id = "loaderText";

    bar.appendChild(fill);
    document.body.appendChild(bar);
    document.body.appendChild(text);

    // inject CSS dynamically (no file touch)
    const style = document.createElement("style");
    style.innerHTML = `
        #loaderBar {
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            width: 100%;
            background: #e5e7eb;
            z-index: 9999;
        }

        #loaderFill {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #4f46e5, #22c55e);
            transition: width 0.2s ease;
        }

        #loaderText {
            position: fixed;
            top: 5px;
            right: 10px;
            font-size: 11px;
            color: #374151;
            z-index: 9999;
        }
    `;
    document.head.appendChild(style);
}

function startLoader(){

    createLoader();

    progress = 0;
    updateLoader();

    clearInterval(interval);

    interval = setInterval(() => {

        if (progress < 85) {
            progress += Math.random() * 8;
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
    }, 400);
}

function updateLoader(){

    const fill = document.getElementById("loaderFill");
    const text = document.getElementById("loaderText");

    if (!fill || !text) return;

    fill.style.width = progress + "%";
    text.innerText = Math.floor(progress) + "%";
}

/* =========================
   🔥 HOOK INTO APP LOAD
========================= */

window.addEventListener("load", () => {

    startLoader();

    setTimeout(() => {
        stopLoader();
    }, 700);

});

/* =========================
   🔥 OPTIONAL GLOBAL USE
========================= */

window.startLoader = startLoader;
window.stopLoader = stopLoader;