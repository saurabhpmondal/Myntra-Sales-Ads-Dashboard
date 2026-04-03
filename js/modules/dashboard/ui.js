import { renderLineChart } from "../../ui/components/charts/lineChart.js";

export function renderDashboard(data) {

    const content = document.getElementById("content");

    content.innerHTML = `
        <div class="kpi-grid">

            <div class="card kpi-card">
                <h3>GMV</h3>
                <p>${data.kpi.gmv.toFixed(0)}</p>
            </div>

            <div class="card kpi-card">
                <h3>Units</h3>
                <p>${data.kpi.units}</p>
            </div>

            <div class="card kpi-card">
                <h3>ASP</h3>
                <p>${data.kpi.asp.toFixed(2)}</p>
            </div>

            <div class="card kpi-card">
                <h3>Ad Spend</h3>
                <p>${data.kpi.spend.toFixed(0)}</p>
            </div>

            <div class="card kpi-card">
                <h3>Ad Revenue</h3>
                <p>${data.kpi.revenue.toFixed(0)}</p>
            </div>

        </div>

        <div class="card">
            <canvas id="salesChart"></canvas>
        </div>

        <div class="card">
            <canvas id="adsChart"></canvas>
        </div>
    `;

    const salesLabels = Object.keys(data.charts.sales);
    const salesData = Object.values(data.charts.sales);

    renderLineChart("salesChart", salesLabels, salesData, [], "Sales", "");

    const adsLabels = Object.keys(data.charts.ads);
    const spend = adsLabels.map(d => data.charts.ads[d].spend);
    const rev = adsLabels.map(d => data.charts.ads[d].revenue);

    renderLineChart("adsChart", adsLabels, spend, rev, "Spend", "Revenue");
}