import { renderFilters } from "./ui.js";
import { runDashboard } from "../modules/dashboard/binder.js";

export function initFilters() {

    renderFilters();

    attachEvents();

    // 🔥 DEFAULT STATE → CURRENT MONTH
    const { from, to } = getCurrentMonth();

    window.APP_STATE = {
        from,
        to,
        brand: ""
    };

    runDashboard();
}

/* ---------- EVENTS ---------- */

function attachEvents() {

    // APPLY BUTTON (custom date + brand)
    document.getElementById("applyFilters")
        .addEventListener("click", applyCustom);

    // BRAND CHANGE (independent filter)
    document.getElementById("brandFilter")
        .addEventListener("change", applyBrand);

    // QUICK FILTERS
    document.querySelectorAll(".quick-filters button")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                const type = btn.dataset.type;

                const { from, to } = getPresetRange(type);

                // 🔥 KEEP BRAND INTACT
                const brand = window.APP_STATE?.brand || "";

                window.APP_STATE = { from, to, brand };

                highlight(btn);

                runDashboard();
            });
        });
}

/* ---------- APPLY CUSTOM DATE ---------- */

function applyCustom() {

    const from = document.getElementById("fromDate").value;
    const to = document.getElementById("toDate").value;
    const brand = document.getElementById("brandFilter").value;

    window.APP_STATE = {
        from,
        to,
        brand
    };

    runDashboard();
}

/* ---------- BRAND ONLY CHANGE ---------- */

function applyBrand() {

    const brand = document.getElementById("brandFilter").value;

    // 🔥 KEEP EXISTING DATE (VERY IMPORTANT)
    const from = window.APP_STATE?.from;
    const to = window.APP_STATE?.to;

    window.APP_STATE = {
        from,
        to,
        brand
    };

    runDashboard();
}

/* ---------- PRESETS ---------- */

function getPresetRange(type) {

    const today = new Date();

    let from, to;

    if (type === "7d") {
        to = today;
        from = new Date();
        from.setDate(today.getDate() - 7);
    }

    if (type === "month") {
        return getCurrentMonth();
    }

    if (type === "lastMonth") {
        from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        to = new Date(today.getFullYear(), today.getMonth(), 0);
    }

    return {
        from: format(from),
        to: format(to)
    };
}

/* ---------- CURRENT MONTH ---------- */

function getCurrentMonth() {

    const today = new Date();

    const from = new Date(today.getFullYear(), today.getMonth(), 1);
    const to = today;

    return {
        from: format(from),
        to: format(to)
    };
}

/* ---------- UI HELPERS ---------- */

function highlight(activeBtn) {

    document.querySelectorAll(".quick-filters button")
        .forEach(b => b.classList.remove("active"));

    activeBtn.classList.add("active");
}

/* ---------- DATE FORMAT ---------- */

function format(d) {
    return d.toISOString().split("T")[0];
}