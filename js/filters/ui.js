import { initFilters } from "./binder.js";

export function renderFilters() {

    const el = document.getElementById("filters");

    el.innerHTML = `
        <div class="card filter-bar">

            <div class="filter-left">
                <button data-type="7d">Last 7 Days</button>
                <button data-type="month">This Month</button>
                <button data-type="lastMonth">Last Month</button>
            </div>

            <div class="filter-right">
                <input type="date" id="startDate">
                <span>to</span>
                <input type="date" id="endDate">
                <button id="applyCustom">Apply</button>
            </div>

        </div>
    `;

    initFilters();
}