import { renderLineChart } from "../../ui/components/charts/lineChart.js";

export function renderDashboard(data) {

    const content = document.getElementById("content");

    if (!data) {
        content.innerHTML = "<p>No data available</p>";
        return;
    }

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
                    ${buildBrandRows(data.brandMap)}
                </tbody>
            </table>
        </div>
    `;

    renderCharts(data);
}

/* ---------- HELPERS ---------- */

function renderCharts(data) {

    // SALES
    const salesLabels = Object.keys(data.charts.sales || {});
    const salesData = Object.values(data.charts.sales || {});

    renderLineChart(
        "salesChart",
        salesLabels,
        salesData,
        [],
        "Sales",
        ""
    );

    // ADS
    const adsLabels = Object.keys(data.charts.ads || {});
    const spend = adsLabels.map(d => data.charts.ads[d]?.spend || 0);
    const revenue = adsLabels.map(d => data.charts.ads[d]?.revenue || 0);

    renderLineChart(
        "adsChart",
        adsLabels,
        spend,
        revenue,
        "Spend",
        "Revenue"
    );
}

function buildBrandRows(map = {}) {

    return Object.entries(map).map(([brand, v]) => `
        <tr>
            <td>${brand}</td>
            <td>${format(v.gmv)}</td>
            <td>${format(v.units)}</td>
            <td>${format(v.units ? v.gmv / v.units : 0)}</td>
            <td>${format(v.PPMP)}</td>
            <td>${format(v.SJIT)}</td>
            <td>${format(v.SOR)}</td>
        </tr>
    `).join("");
}

function format(val) {
    if (!val && val !== 0) return "0";
    return Number(val).toLocaleString();
}

function percent(val) {
    if (!val && val !== 0) return "0%";
    return (val * 100).toFixed(2) + "%";
}