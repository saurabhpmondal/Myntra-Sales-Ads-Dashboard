export function renderFilters() {

    const el = document.getElementById("filters");

    const sales = window.APP_DATA?.SALES || [];

    // UNIQUE BRANDS
    const brands = [...new Set(sales.map(r => r.brand))].filter(Boolean).sort();

    el.innerHTML = `
        <div class="filter-bar">

            <div class="filter-item">
                <label>From Date</label>
                <input type="date" id="fromDate">
            </div>

            <div class="filter-item">
                <label>To Date</label>
                <input type="date" id="toDate">
            </div>

            <div class="filter-item">
                <label>Brand</label>
                <select id="brandFilter">
                    <option value="">All Brands</option>
                    ${brands.map(b => `<option value="${b}">${b}</option>`).join("")}
                </select>
            </div>

            <div class="filter-item">
                <button id="applyFilters">Apply</button>
            </div>

        </div>
    `;
}