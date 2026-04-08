import { renderLineChart } from "../../ui/components/charts/lineChart.js";
import { runCampaign } from "../campaign/binder.js";
import { runDailyAds } from "../product/binder.js";
import { runPlacement } from "../placement/binder.js";
import { runListings } from "../listings/binder.js";
import { runTraffic } from "../traffic/binder.js";
import { runAlerts } from "../alerts/binder.js";
import { runTopStyles } from "../topStyles/binder.js";

// 🔥 NEW
import { runDayWise } from "../dayWise/binder.js";

export function renderDashboard(data) {

    const content = document.getElementById("content");

    const k = data.kpi || {};

    content.innerHTML = `
        <div class="dashboard">

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

            <div class="tabs">
                ${tab("campaign","Campaign",true)}
                ${tab("placement","Placement")}
                ${tab("product","Daily Ads")}
                ${tab("listings","Listings")}
                ${tab("traffic","Traffic")}
                ${tab("alerts","Alerts")}
                ${tab("topstyles","Top Styles")}
                ${tab("daywise","Day Wise")} <!-- 🔥 NEW TAB -->
            </div>

            <div id="reportContainer" class="card"></div>

        </div>
    `;

    renderCharts(data);
    initTabs();
}

function renderCharts(data) {

    const sales = data.charts?.sales || {};
    const unitsMap = data.charts?.units || {};

    const labels = Object.keys(sales);

    const gmv = labels.map(d => sales[d] || 0);
    const units = labels.map(d => unitsMap[d] || 0);

    renderLineChart("salesChart", labels, gmv, units, "GMV", "Units");
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
    if (type === "topstyles") return runTopStyles();

    // 🔥 NEW
    if (type === "daywise") return runDayWise();

    document.getElementById("reportContainer").innerHTML =
        `<div style="padding:20px">${type.toUpperCase()} coming next</div>`;
}

/* helpers unchanged */
function kpi(title, value, type, k){
    const signal = get