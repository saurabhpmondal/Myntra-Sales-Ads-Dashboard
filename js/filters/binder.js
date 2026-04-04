import { renderFilters } from "./ui.js";
import { runDashboard } from "../modules/dashboard/binder.js";

export function initFilters() {

    renderFilters();

    attachEvents();

    // DEFAULT = CURRENT MONTH
    applyPreset("month");
}

function attachEvents() {

    document.getElementById("applyFilters")
        .addEventListener("click", applyCustom);

    document.querySelectorAll(".quick-filters button")
        .forEach(btn => {
            btn.addEventListener("click", () => {
                applyPreset(btn.dataset.type);

                document.querySelectorAll(".quick-filters button")
                    .forEach(b => b.classList.remove("active"));

                btn.classList.add("active");
            });
        });
}

function applyPreset(type) {

    const today = new Date();

    let from, to;

    if (type === "7d") {
        to = today;
        from = new Date();
        from.setDate(today.getDate() - 7);
    }

    if (type === "month") {
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        to = today;
    }

    if (type === "lastMonth") {
        from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        to = new Date(today.getFullYear(), today.getMonth(), 0);
    }

    updateState(from, to);
}

function applyCustom() {

    const from = document.getElementById("fromDate").value;
    const to = document.getElementById("toDate").value;
    const brand = document.getElementById("brandFilter").value;

    window.APP_STATE = { from, to, brand };

    runDashboard();
}

function updateState(from, to) {

    const brand = document.getElementById("brandFilter").value;

    window.APP_STATE = {
        from: format(from),
        to: format(to),
        brand
    };

    runDashboard();
}

function format(d) {
    return d.toISOString().split("T")[0];
}