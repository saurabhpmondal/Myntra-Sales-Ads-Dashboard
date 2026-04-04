export function renderFilters() {

    const el = document.getElementById("filters");

    const sales = window.APP_DATA?.SALES || [];

    const brands = [...new Set(sales.map(r => r.brand))]
        .filter(Boolean)
        .sort();

    el.innerHTML = `
        <div class="filter-bar">

            <div class="quick-filters">
                <button data-type="7d">Last 7 Days</button>
                <button data-type="month" class="active">This Month</button>
                <button data-type="lastMonth">Last Month</button>
            </div>

            <div class="filter-item">
                <label>From</label>
                <input type="date" id="fromDate">
            </div>

            <div class="filter-item">
                <label>To</label>
                <input type="date" id="toDate">
            </div>

            <div class="filter-item">
                <label>Brand</label>
                <select id="brandFilter">
                    <option value="">All</option>
                    ${brands.map(b => `<option value="${b}">${b}</option>`).join("")}
                </select>
            </div>

            <div class="filter-item">
                <button id="applyFilters">Apply</button>
            </div>

        </div>
    `;
}