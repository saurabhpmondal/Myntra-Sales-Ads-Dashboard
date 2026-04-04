import { renderFilters } from "./ui.js";
import { runDashboard } from "../modules/dashboard/binder.js";

export function initFilters() {

    renderFilters();

    document.getElementById("applyFilters")
        .addEventListener("click", applyFilters);
}

function applyFilters() {

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