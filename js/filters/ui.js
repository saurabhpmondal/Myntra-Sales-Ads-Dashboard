export function renderFilters() {

    const el = document.getElementById("filters");

    const sales = window.APP_DATA?.SALES || [];

    const brands = [...new Set(sales.map(r => r.brand))].filter(Boolean);

    el.innerHTML = `
        <div class="filter-bar">

            <div class="filter-group">
                <label>From</label>
                <input type="date" id="fromDate">
            </div>

            <div class="filter-group">
                <label>To</label>
                <input type="date" id="toDate">
            </div>

            <div class="filter-group">
                <label>Brand</label>
                <select id="brandFilter">
                    <option value="">All</option>
                    ${brands.map(b => `<option value="${b}">${b}</option>`).join("")}
                </select>
            </div>

            <button id="applyFilters">Apply</button>

        </div>
    `;
}