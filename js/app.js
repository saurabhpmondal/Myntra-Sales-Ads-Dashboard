/* =========================
   🔥 IMPORTS
========================= */

import { loadAllData } from "./core/dataLoader.js";
import { parseCSV } from "./core/dataParser.js";
import { setData } from "./core/dataRegistry.js";
import { renderDashboard } from "./modules/dashboard/ui.js";

/* =========================
   🔥 GLOBAL STATE
========================= */

window.APP_STATE = {};

/* =========================
   🔥 LOADER
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
   🚀 INIT APP
========================= */

async function initApp(){

    try {

        startLoader();

        // 1. Load raw CSV
        const raw = await loadAllData();

        // 2. Parse EACH file (IMPORTANT FIX)
        const parsed = {
            CDR: parseCSV(raw.CDR),
            CPR: parseCSV(raw.CPR),
            PPR: parseCSV(raw.PPR),
            SALES: parseCSV(raw.SALES),
            TRAFFIC: parseCSV(raw.TRAFFIC)
        };

        // 3. Store in registry
        setData(parsed);

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
   🔥 START
========================= */

window.addEventListener("load", () => {
    initApp();
});

window.startLoader = startLoader;
window.stopLoader = stopLoader;