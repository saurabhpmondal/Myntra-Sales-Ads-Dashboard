import { renderLineChart } from "../../ui/components/charts/lineChart.js";
import { runCampaign } from "../campaign/binder.js";
import { runDailyAds } from "../product/binder.js";
import { runPlacement } from "../placement/binder.js";
import { runListings } from "../listings/binder.js";
import { runTraffic } from "../traffic/binder.js";
import { runAlerts } from "../alerts/binder.js";

export function renderDashboard(data) {

    const content = document.getElementById("content");

    const k = data.kpi || {};

    content.innerHTML = `
        <div class="dashboard">

            <div class="kpi-grid">
                ${kpi("GMV", fmt(k.gmv))}
                ${kpi("Units", fmt(k.units))}
                ${kpi("ASP", fmt2(k.asp))}
                ${kpi("Spend", fmt(k.spend))}
                ${kpi("Revenue", fmt(k.revenue))}
                ${kpi("ROI", fmt2(k.roi))}
            </div>

            <div class="card">
                <h3>Sales Trend</h3>
                <canvas id="salesChart"></canvas>
            </div>

            <div class="card table-card">
                <h3>Brand Performance</h3>
                <div class="table-wrapper">
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
            </div>

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

function renderCharts(data) {
    const labels = Object.keys(data.charts?.sales || {});
    const values = Object.values(data.charts?.sales || {});
    renderLineChart("salesChart", labels, values, [], "Sales", "");
}

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

    if (type === "campaign") return runCampaign();
    if (type === "placement") return runPlacement();
    if (type === "product") return runDailyAds();
    if (type === "listings") return runListings();
    if (type === "traffic") return runTraffic();
    if (type === "alerts") return runAlerts();

    document.getElementById("reportContainer").innerHTML =
        `<div style="padding:20px">${type.toUpperCase()} coming next</div>`;
}

function kpi(title, value){
    return `<div class="kpi-card"><h3>${title}</h3><p>${value}</p></div>`;
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