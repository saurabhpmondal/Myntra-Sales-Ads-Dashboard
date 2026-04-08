import { buildStyleIntelligence } from "../styleIntelligence/engine.js";
import { renderLineChart } from "../../ui/components/charts/lineChart.js";

export function renderDeepDive(){

    const container = document.getElementById("reportContainer");

    container.innerHTML = `
        <div class="card">

            <h3>Deep Dive</h3>

            <div class="top-style-filters">
                <input id="ddSearch" placeholder="Enter Style ID..." />
                <button id="ddSearchBtn">Search</button>
            </div>

            <div id="ddResult" style="margin-top:16px;"></div>

        </div>
    `;

    document.getElementById("ddSearchBtn").onclick = runSearch;

    function runSearch(){

        const styleId = document.getElementById("ddSearch").value.trim();

        if (!styleId) return alert("Enter style ID");

        const data = buildStyleIntelligence(styleId);

        if (!data || (!data.kpi.units && !data.kpi.revenue)){
            document.getElementById("ddResult").innerHTML =
                `<p style="color:red;">❌ Style not found</p>`;
            return;
        }

        renderFull(data);
    }
}

/* 🔥 FULL UI (MATCHING YOUR OLD ONE BUT CLEAN) */

function renderFull(d){

    const el = document.getElementById("ddResult");

    el.innerHTML = `
        <div class="card">

            <h3>${d.style_id} • ${d.brand}</h3>

            <!-- KPI GRID -->
            <div class="si-kpi-grid clean">

                ${kpi("Units", d.kpi.units)}
                ${kpi("Revenue", d.kpi.revenue)}
                ${kpi("ASP", d.kpi.asp)}

                ${kpi("Ad Spend", d.kpi.ad_spend)}
                ${kpi("Ad Revenue", d.kpi.ad_revenue)}
                ${kpi("ROI", d.kpi.roi)}

                ${kpi("Impressions", d.kpi.impressions)}
                ${kpi("Clicks", d.kpi.clicks)}
                ${kpi("CVR", d.kpi.cvr)}

            </div>

            <!-- SALES TREND -->
            <div class="card">
                <h3>Sales Trend</h3>
                <canvas id="ddChart"></canvas>
            </div>

            <!-- TRAFFIC FUNNEL -->
            <div class="card">
                <h3>Traffic Funnel</h3>
                <div class="si-funnel clean">
                    ${box("Impressions", d.traffic.impressions)}
                    ${arrow()}
                    ${box("Clicks", d.traffic.clicks)}
                    ${arrow()}
                    ${box("ATC", d.traffic.atc)}
                    ${arrow()}
                    ${box("Orders", d.traffic.orders)}
                </div>
            </div>

            <!-- MONTH COMPARISON -->
            <div class="card">
                <h3>Month Comparison</h3>
                <div class="si-compare clean">
                    <div>
                        <span>Current</span>
                        <strong>${fmt(d.comparison.units)}</strong>
                    </div>
                    <div>
                        <span>Last</span>
                        <strong>${fmt(d.comparison.last_units)}</strong>
                    </div>
                    <div>
                        <span>Growth</span>
                        <strong class="${growthClass(d.comparison.growth)}">
                            ${pct(d.comparison.growth)}
                        </strong>
                    </div>
                </div>
            </div>

            <!-- FUTURE -->
            <div class="card"><h3>Inventory (Coming Soon)</h3></div>
            <div class="card"><h3>Profit (Coming Soon)</h3></div>
            <div class="card"><h3>Returns (Coming Soon)</h3></div>

        </div>
    `;

    /* 🔥 CHART */
    const labels = Object.keys(d.trend || {});
    const revenue = labels.map(k => d.trend[k]?.revenue || 0);

    renderLineChart("ddChart", labels, revenue, [], "Revenue", "");
}

/* ---------- UI BLOCKS ---------- */

function kpi(t,v){
    return `
        <div class="si-kpi clean-box">
            <span>${t}</span>
            <strong>${fmt(v)}</strong>
        </div>
    `;
}

function box(t,v){
    return `<div class="si-funnel-box clean-box">${t}<br><strong>${fmt(v)}</strong></div>`;
}

function arrow(){
    return `<div class="si-arrow">→</div>`;
}

/* ---------- HELPERS ---------- */

function fmt(n){ return Number(n||0).toLocaleString(); }
function pct(n){ return (n||0).toFixed(1)+"%"; }

function growthClass(n){
    if(n > 0) return "kpi-good";
    if(n < 0) return "kpi-bad";
    return "";
}