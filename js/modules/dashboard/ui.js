import { renderLineChart } from "../../ui/components/charts/lineChart.js";

export function renderDashboard(data) {

    const content = document.getElementById("content");

    // Guard (don’t crash UI if data missing)
    if (!data || !data.kpi) {
        content.innerHTML = "<p>No data available</p>";
        return;
    }

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

        <!-- Charts -->
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

        <!-- Brand Table -->
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
                    ${brandRows(data.brandMap)}
                </tbody>
            </table>
        </div>
    `;

    // Charts (safe)
    const salesLabels = Object.keys(data.charts?.sales || {});
    const salesData = Object.values(data.charts?.sales || {});

    renderLineChart("salesChart", salesLabels, salesData, [], "Sales", "");

    const adsLabels = Object.keys(data.charts?.ads || {});
    const spend = adsLabels.map(d => data.charts.ads[d]?.spend || 0);
    const revenue = adsLabels.map(d => data.charts.ads[d]?.revenue || 0);

    renderLineChart("adsChart", adsLabels, spend, revenue, "Spend", "Revenue");
}

/* ---------- helpers ---------- */

function brandRows(map = {}) {
    return Object.entries(map).map(([b, v]) => `
        <tr>
            <td>${b}</td>
            <td>${fmt(v.gmv)}</td>
            <td>${fmt(v.units)}</td>
            <td>${fmt2(v.units ? v.gmv / v.units : 0)}</td>
            <td>${fmt(v.PPMP)}</td>
            <td>${fmt(v.SJIT)}</td>
            <td>${fmt(v.SOR)}</td>
        </tr>
    `).join("");
}

function fmt(n) {
    if (n === null || n === undefined || isNaN(Number(n))) return "0";
    return Number(n).toLocaleString();
}

function fmt2(n) {
    if (n === null || n === undefined || isNaN(Number(n))) return "0.00";
    return Number(n).toFixed(2);
}

function pct(n) {
    if (n === null || n === undefined || isNaN(Number(n))) return "0%";
    return (Number(n) * 100).toFixed(2) + "%";
}