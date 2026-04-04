import { renderLineChart } from "../../ui/components/charts/lineChart.js";

export function renderDashboard(data) {

    const content = document.getElementById("content");

    content.innerHTML = `
        <div class="dashboard">

            <!-- KPI -->
            <div class="kpi-grid">

                <!-- SALES -->
                ${kpi("GMV", fmt(data.kpi.gmv))}
                ${kpi("Units", fmt(data.kpi.units))}
                ${kpi("ASP", fmt2(data.kpi.asp))}

                <!-- ADS -->
                ${kpi("Spend", fmt(data.kpi.spend))}
                ${kpi("Revenue", fmt(data.kpi.revenue))}
                ${kpi("ROI", fmt2(data.kpi.roi))}

            </div>

            <!-- SALES CHART ONLY -->
            <div class="card">
                <h3>Sales Trend</h3>
                <canvas id="salesChart"></canvas>
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

            <div id="reportContainer" class="card"></div>

        </div>
    `;

    renderCharts(data);
    initTabs();
}

/* ---------- CHART ---------- */

function renderCharts(data) {

    const labels = Object.keys(data.charts.sales);
    const values = Object.values(data.charts.sales);

    renderLineChart("salesChart", labels, values, [], "Sales", "");
}

/* ---------- HELPERS ---------- */

function kpi(title, value){
    return `
        <div class="kpi-card">
            <h3>${title}</h3>
            <p>${value}</p>
        </div>
    `;
}

function tab(id, name, active=false){
    return `<div class="tab ${active?"active":""}" data-type="${id}">${name}</div>`;
}

function brandRows(map={}){
    return Object.entries(map).map(([b,v])=>`
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

function fmt(n){ return Number(n||0).toLocaleString(); }
function fmt2(n){ return Number(n||0).toFixed(2); }

/* ---------- TABS ---------- */

function initTabs(){

    const tabs = document.querySelectorAll(".tab");

    tabs.forEach(tab=>{
        tab.onclick = ()=>{
            tabs.forEach(t=>t.classList.remove("active"));
            tab.classList.add("active");

            renderReport(tab.dataset.type);
        };
    });

    renderReport("campaign");
}

function renderReport(type){

    const el = document.getElementById("reportContainer");

    el.innerHTML = `<div style="padding:20px">${type.toUpperCase()} report coming next</div>`;
}