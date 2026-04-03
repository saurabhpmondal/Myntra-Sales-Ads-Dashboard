import { renderLineChart } from "../../ui/components/charts/lineChart.js";
import { loadModule } from "../../router/appRouter.js";

export function renderDashboard(data) {

    const content = document.getElementById("content");

    content.innerHTML = `

        <!-- KPI -->
        <div class="kpi-grid">
            <div class="card kpi-card"><h3>GMV</h3><p>${data.kpi.gmv.toLocaleString()}</p></div>
            <div class="card kpi-card"><h3>Units</h3><p>${data.kpi.units}</p></div>
            <div class="card kpi-card"><h3>ASP</h3><p>${data.kpi.asp.toFixed(2)}</p></div>
            <div class="card kpi-card"><h3>Spend</h3><p>${data.kpi.spend.toLocaleString()}</p></div>
            <div class="card kpi-card"><h3>Revenue</h3><p>${data.kpi.revenue.toLocaleString()}</p></div>
            <div class="card kpi-card"><h3>CTR</h3><p>${(data.kpi.ctr*100).toFixed(2)}%</p></div>
            <div class="card kpi-card"><h3>ROI</h3><p>${data.kpi.roi.toFixed(2)}</p></div>
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
                    ${Object.entries(data.brandMap).map(([b,v])=>`
                        <tr>
                            <td>${b}</td>
                            <td>${v.gmv.toFixed(0)}</td>
                            <td>${v.units}</td>
                            <td>${(v.gmv/v.units||0).toFixed(2)}</td>
                            <td>${v.PPMP.toFixed(0)}</td>
                            <td>${v.SJIT.toFixed(0)}</td>
                            <td>${v.SOR.toFixed(0)}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>

        <!-- TABS -->
        <div class="tabs">
            <div class="tab" data-tab="campaign">Campaign</div>
            <div class="tab" data-tab="placement">Placement</div>
            <div class="tab" data-tab="product">Daily Ads</div>
            <div class="tab" data-tab="listings">Listings</div>
            <div class="tab" data-tab="salesTrend">Traffic</div>
            <div class="tab" data-tab="alerts">Alerts</div>
        </div>

        <div id="reportContainer"></div>
    `;

    // Charts
    const salesLabels = Object.keys(data.charts.sales);
    const salesData = Object.values(data.charts.sales);
    renderLineChart("salesChart", salesLabels, salesData, [], "Sales", "");

    const adsLabels = Object.keys(data.charts.ads);
    const spend = adsLabels.map(d => data.charts.ads[d].spend);
    const rev = adsLabels.map(d => data.charts.ads[d].revenue);
    renderLineChart("adsChart", adsLabels, spend, rev, "Spend", "Revenue");

    initTabs();
}

function initTabs() {

    const tabs = document.querySelectorAll(".tab");

    tabs.forEach(tab => {

        tab.onclick = () => {

            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const module = tab.dataset.tab;

            loadModule(module, "reportContainer");
        };
    });

    // ❌ NO AUTO LOAD HERE
}