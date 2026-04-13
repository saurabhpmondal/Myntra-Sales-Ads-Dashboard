import { renderLineChart } from "../../ui/components/charts/lineChart.js";
import { runCampaign } from "../campaign/binder.js";
import { runDailyAds } from "../product/binder.js";
import { runPlacement } from "../placement/binder.js";
import { runListings } from "../listings/binder.js";
import { runTraffic } from "../traffic/binder.js";
import { runAlerts } from "../alerts/binder.js";
import { runTopStyles } from "../topStyles/binder.js";
import { runDayWise } from "../dayWise/binder.js";
import { runDeepDive } from "../deepDive/binder.js";
import { runSJITPlanning } from "../sjitPlanning/binder.js";

let DASHBOARD_DATA = {};

export function renderDashboard(data) {

    DASHBOARD_DATA = data || {};

    const content = document.getElementById("content");

    content.innerHTML = `
        <div class="dashboard">

            <div class="tabs">
                ${tab("dashboard","Dashboard",true)}
                ${tab("campaign","Campaign")}
                ${tab("placement","Placement")}
                ${tab("product","Daily Ads")}
                ${tab("listings","Listings")}
                ${tab("traffic","Traffic")}
                ${tab("alerts","Alerts")}
                ${tab("topstyles","Top Styles")}
                ${tab("daywise","Day Wise")}
                ${tab("deepdive","Deep Dive")}
                ${tab("sjit","SJIT Planning")}
            </div>

            <div id="reportContainer"></div>

        </div>
    `;

    initTabs();
    renderReport("dashboard");
}

/* ========================= */

function initTabs(){

    const tabs = document.querySelectorAll(".tab");

    tabs.forEach(tab => {

        tab.onclick = () => {

            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            renderReport(tab.dataset.type);
        };
    });
}

/* ========================= */

function renderReport(type){

    if (type === "dashboard") return renderMainDashboard();

    if (type === "campaign") return runCampaign();
    if (type === "placement") return runPlacement();
    if (type === "product") return runDailyAds();
    if (type === "listings") return runListings();
    if (type === "traffic") return runTraffic();
    if (type === "alerts") return runAlerts();
    if (type === "topstyles") return runTopStyles();
    if (type === "daywise") return runDayWise();
    if (type === "deepdive") return runDeepDive();
    if (type === "sjit") return runSJITPlanning();

    document.getElementById("reportContainer").innerHTML =
        `<div class="card" style="padding:20px">${type} coming soon</div>`;
}

/* ========================= */

function renderMainDashboard(){

    const data = DASHBOARD_DATA;
    const k = data.kpi || {};

    const container = document.getElementById("reportContainer");

    container.innerHTML = `
        <div class="dashboard-home">

            <div class="kpi-grid">
                ${kpi("GMV", fmt(k.gmv), "gmv", k)}
                ${kpi("Units", fmt(k.units), "units", k)}
                ${kpi("ASP", fmt2(k.asp), "asp", k)}
                ${kpi("Spend", fmt(k.spend), "spend", k)}
                ${kpi("Revenue", fmt(k.revenue), "revenue", k)}
                ${kpi("ROI", fmt2(k.roi), "roi", k)}
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

        </div>
    `;

    renderCharts(data);
}

/* ========================= */

function renderCharts(data){

    const sales = data.charts?.sales || {};
    const unitsMap = data.charts?.units || {};

    const labels = Object.keys(sales);

    const gmv = labels.map(d => sales[d] || 0);
    const units = labels.map(d => unitsMap[d] || 0);

    renderLineChart("salesChart", labels, gmv, units, "GMV", "Units");
}

/* ========================= */

function kpi(title, value, type, k){

    const signal = getSignal(type, k);

    return `
        <div class="kpi-card ${signal.class}">
            <h3>${title}</h3>
            <p>${value}</p>
            <span class="kpi-signal">${signal.icon}</span>
        </div>
    `;
}

function getSignal(type, k){

    switch(type){

        case "roi":
            if (k.roi >= 3) return good();
            if (k.roi < 1) return bad();
            return neutral();

        case "spend":
            if (k.spend > k.revenue) return bad();
            return neutral();

        case "revenue":
            if (k.revenue > k.spend) return good();
            return neutral();

        default:
            return neutral();
    }
}

function good(){ return { class:"kpi-good", icon:"▲" }; }
function bad(){ return { class:"kpi-bad", icon:"▼" }; }
function neutral(){ return { class:"", icon:"" }; }

/* ========================= */

function tab(id, name, active=false){
    return `<div class="tab ${active ? "active" : ""}" data-type="${id}">${name}</div>`;
}

/* ========================= */

function brandRows(map={}){

    return Object.entries(map)
        .sort((a,b) => (b[1].gmv || 0) - (a[1].gmv || 0))
        .map(([brand,v]) => `
            <tr>
                <td>${brand}</td>
                <td>${fmt(v.gmv)}</td>
                <td>${fmt(v.units)}</td>
                <td>${fmt2(v.units ? v.gmv / v.units : 0)}</td>
                <td>${fmt(v.PPMP)}</td>
                <td>${fmt(v.SJIT)}</td>
                <td>${fmt(v.SOR)}</td>
            </tr>
        `).join("");
}

/* ========================= */

function fmt(n){
    return Number(n || 0).toLocaleString();
}

function fmt2(n){
    return Number(n || 0).toFixed(2);
}