export function renderFilters() {

    const el = document.getElementById("filters");

    el.innerHTML = `
        <div class="card">
            <button data-type="7d">Last 7 Days</button>
            <button data-type="month">This Month</button>
        </div>
    `;
}