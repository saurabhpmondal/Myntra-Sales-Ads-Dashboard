import { renderLineChart } from "../../ui/components/charts/lineChart.js";

export function renderDashboard(data) {

    const content = document.getElementById("content");

    content.innerHTML = `

        <!-- KPI -->
        <div class="kpi-grid">
            <div class="card kpi-card"><h3>GMV</h3><p>${fmt(data.kpi.gmv)}</p></div>
            <div class="card kpi-card"><h3>Units</h3><p>${fmt(data.kpi.units)}</p></div>
            <div class="card kpi-card"><h3>ASP</h3><p>${fmt2(data.kpi.asp)}</p></div>
            <div class="card kpi-card"><h3>Spend</h3><p>${fmt(data.kpi.spend)}</p></div>
            <div class="card kpi-card"><h3>Revenue</h3><p>${fmt(data.kpi.revenue)}</p></div>
            <div class="card kpi-card"><h3>CTR</h3><p>${pct(data.kpi.ctr)}</p></div>
            <div class="card kpi-card"><h3>ROI</h3><p>${fmt2(data.kpi.roi)}</p></div>
        </div>

        <!-- CHARTS -->
        <div class="chart-grid">
            <div class="card">
                <h3>Sales Trend</h3>
                <canvas id="salesChart"></canvas>
            </div>
            <div class="card">
                <h3>Ads Trend</h3>
                <canvas id="adsChart"></canvas>
            </div>
        </div>

        <!-- BRAND TABLE -->
        <div class="card">
            <h3>Brand Performance</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Brand</th>
                        <th>GMV</th>
                        <th>Units</th>
                        <th>ASP</th>
                        <th>PPMP</th>
                        <th>SJIT</th>
                        <th>SOR</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(data.brandMap).map(([b,v]) => `
                        <tr>
                            <td>${b}</td>
                            <td>${fmt(v.gmv)}</td>
                            <td>${fmt(v.units)}</td>
                            <td>${fmt2(v.units ? v.gmv/v.units : 0)}</td>
                            <td>${fmt(v.PPMP)}</td>
                            <td>${fmt(v.SJIT)}</td>
                            <td>${fmt(v.SOR)}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;

    renderCharts(data);
}

/* ---------- CHARTS ---------- */

function renderCharts(data) {

    const salesLabels = Object.keys(data.charts.sales);
    const salesData = Object.values(data.charts.sales);

    renderLineChart("salesChart", salesLabels, salesData, [], "Sales", "");

    const adsLabels = Object.keys(data.charts.ads);
    const spend = adsLabels.map(d => data.charts.ads[d].spend);
    const revenue = adsLabels.map(d => data.charts.ads[d].revenue);

    renderLineChart("adsChart", adsLabels, spend, revenue, "Spend", "Revenue");
}

/* ---------- HELPERS ---------- */

function fmt(n) {
    return Number(n || 0).toLocaleString();
}

function fmt2(n) {
    return Number(n || 0).toFixed(2);
}

function pct(n) {
    return ((n || 0) * 100).toFixed(2) + "%";
}