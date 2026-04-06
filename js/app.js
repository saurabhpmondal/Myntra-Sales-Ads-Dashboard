/* =========================
   🔥 IMPORTS (CRITICAL)
========================= */

import { loadAllData } from "./core/dataLoader.js";
import { parseAllData } from "./core/dataParser.js";
import { setData } from "./core/dataRegistry.js";
import { renderDashboard } from "./modules/dashboard/ui.js";

/* =========================
   🔥 GLOBAL STATE
========================= */

window.APP_STATE = {};

/* =========================
   🔥 LOADER SYSTEM
========================= */

let progress = 0;
let interval = null;

function startLoader(){
    progress = 0;
    updateLoader();

    clearInterval(interval);

    interval = setInterval(() => {
        if (progress < 85) {
            progress += Math.random() * 10;
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
   🚀 INIT APP (MAIN FIX)
========================= */

async function initApp(){

    try {

        startLoader();

        // 1. Load raw CSV
        const raw = await loadAllData();

        // 2. Parse CSV → JSON
        const parsed = parseAllData(raw);

        // 3. Store in registry
        setData(parsed);

        // expose globally (for debug)
        window.DATA_REGISTRY = parsed;

        // 4. Render dashboard
        renderDashboard(parsed);

    } catch (e) {
        console.error("App Init Error:", e);
    } finally {
        stopLoader();
    }
}

/* =========================
   🔥 START APP
========================= */

window.addEventListener("load", () => {
    initApp();
});

/* =========================
   🔥 OPTIONAL GLOBAL
========================= */

window.startLoader = startLoader;
window.stopLoader = stopLoader;