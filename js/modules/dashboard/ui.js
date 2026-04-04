export function renderDashboard(data) {

    const content = document.getElementById("content");

    content.innerHTML = `
        <div class="kpi-grid">
            <div class="card kpi-card"><h3>GMV</h3><p>${format(data.kpi.gmv)}</p></div>
            <div class="card kpi-card"><h3>Units</h3><p>${format(data.kpi.units)}</p></div>
            <div class="card kpi-card"><h3>ASP</h3><p>${format(data.kpi.asp)}</p></div>
            <div class="card kpi-card"><h3>Spend</h3><p>${format(data.kpi.spend)}</p></div>
            <div class="card kpi-card"><h3>Revenue</h3><p>${format(data.kpi.revenue)}</p></div>
            <div class="card kpi-card"><h3>CTR</h3><p>${percent(data.kpi.ctr)}</p></div>
            <div class="card kpi-card"><h3>ROI</h3><p>${format(data.kpi.roi)}</p></div>
        </div>
    `;
}

function format(n) {
    return Number(n || 0).toLocaleString();
}

function percent(n) {
    return ((n || 0) * 100).toFixed(2) + "%";
}