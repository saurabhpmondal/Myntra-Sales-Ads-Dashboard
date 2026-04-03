export function renderDashboard(data) {

    const content = document.getElementById("content");

    const safe = (v) => Number(v) || 0;

    content.innerHTML = `
        <div class="kpi-grid">

            <div class="card kpi-card">
                <h3>GMV</h3>
                <p>${safe(data.sales.gmv).toFixed(0)}</p>
            </div>

            <div class="card kpi-card">
                <h3>Units</h3>
                <p>${safe(data.sales.units)}</p>
            </div>

            <div class="card kpi-card">
                <h3>ASP</h3>
                <p>${safe(data.sales.asp).toFixed(2)}</p>
            </div>

            <div class="card kpi-card">
                <h3>Ad Spend</h3>
                <p>${safe(data.ads.spend).toFixed(0)}</p>
            </div>

            <div class="card kpi-card">
                <h3>Ad Revenue</h3>
                <p>${safe(data.ads.revenue).toFixed(0)}</p>
            </div>

            <div class="card kpi-card">
                <h3>CTR</h3>
                <p>${(safe(data.ads.ctr) * 100).toFixed(2)}%</p>
            </div>

            <div class="card kpi-card">
                <h3>ROI</h3>
                <p>${safe(data.ads.roi).toFixed(2)}</p>
            </div>

        </div>
    `;
}