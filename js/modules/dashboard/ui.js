import { renderLineChart } from "../../ui/components/charts/lineChart.js";

export function renderDashboard(data) {

    const content = document.getElementById("content");

    content.innerHTML = `
        <div class="dashboard">

            <!-- KPI -->
            <div class="kpi-grid">
                ${kpiCard("GMV", fmt(data.kpi.gmv))}
                ${kpiCard("Units", fmt(data.kpi.units))}
                ${kpiCard("ASP", fmt2(data.kpi.asp))}
                ${kpiCard("Spend", fmt(data.kpi.spend))}
                ${kpiCard("Revenue", fmt(data.kpi.revenue))}
                ${kpiCard("CTR", pct(data.kpi.ctr))}
                ${kpiCard("ROI", fmt2(data.kpi.roi))}
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
                        ${brandRows(data.brandMap)}
                    </tbody>
                </table>
            </div>

            <!-- TABS -->
            <div class="tabs">
                ${tab("campaign","Campaign",true)}
                ${tab("placement","Placement")}
                ${tab("product","Daily Ads")}
                ${tab("listings","Listings")}
                ${tab("traffic","Traffic")}
                ${tab("alerts","Alerts")}
            </div>

            <!-- REPORT CONTAINER -->
            <div id="reportContainer" class="card"></div>

        </div>
    `;

    renderCharts(data);
    initTabs();
}

/* ---------- TABS ---------- */

function initTabs() {

    const tabs = document.querySelectorAll(".tab");

    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const type = tab.dataset.type;

            renderReport(type);
        });
    });

    // DEFAULT LOAD
    renderReport("campaign");
}

/* ---------- REPORT SWITCH ---------- */

function renderReport(type) {

    const container = document.getElementById("reportContainer");

    // Temporary placeholder (next step will replace with real engines)
    container.innerHTML = `
        <div style="padding:20px; font-size:14px;">
            <b>${type.toUpperCase()}</b> report loading...
        </div>
    `;
}

/* ---------- HELPERS ---------- */

function kpiCard(title, value) {
    return `
        <div class="kpi-card">
            <h3>${title}</h3>
            <p>${value}</p>
        </div>
    `;
}

function tab(id, name, active=false) {
    return `
        <div class="tab ${active ? "active" : ""}" data-type="${id}">
            ${name}
        </div>
    `;
}

function brandRows(map={}) {
    return Object.entries(map).map(([b,v]) => `
        <tr>
            <td>${b}</td>
            <td>${fmt(v.gmv)}</td>
            <td>${fmt(v.units)}</td>
            <td>${fmt2(v.units ? v.gmv/v.units : 0)}</td>
            <td>${fmt(v.PPMP)}</td>
            <td>${fmt(v.SJIT)}</td>
            <td>${fmt(v.SOR)}</td>
        </tr>
    `).join("");
}

function renderCharts(data) {

    const salesLabels = Object.keys(data.charts.sales);
    const salesData = Object.values(data.charts.sales);

    renderLineChart("salesChart", salesLabels, salesData, [], "Sales", "");

    const adsLabels = Object.keys(data.charts.ads);
    const spend = adsLabels.map(d => data.charts.ads[d].spend);
    const revenue = adsLabels.map(d => data.charts.ads[d].revenue);

    renderLineChart("adsChart", adsLabels, spend, revenue, "Spend", "Revenue");
}

/* ---------- FORMAT ---------- */

function fmt(n){ return Number(n||0).toLocaleString(); }
function fmt2(n){ return Number(n||0).toFixed(2); }
function pct(n){ return ((n||0)*100).toFixed(2)+"%"; }