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

            <div id="ddResult" style="margin-top:16px;">
                <p style="color:#6b7280;">Search a style to view intelligence</p>
            </div>

        </div>
    `;

    document.getElementById("ddSearchBtn").onclick = runSearch;

    function runSearch(){

        const styleId = document.getElementById("ddSearch").value.trim();

        if (!styleId){
            alert("Enter style ID");
            return;
        }

        let data = null;

        try {
            data = buildStyleIntelligence(styleId);
        } catch (e) {
            console.error(e);
        }

        if (!data){
            document.getElementById("ddResult").innerHTML =
                `<p style="color:red;">❌ Style not found</p>`;
            return;
        }

        renderFull(data);
    }
}

/* =========================
   FULL UI
========================= */

function renderFull(d){

    const el = document.getElementById("ddResult");

    el.innerHTML = `
        <div class="card">

            <h3>${safe(d.style_id)} • ${safe(d.brand)}</h3>

            <!-- 🔥 STYLE SCORE -->
            <div class="card">
                <h3>Style Score</h3>
                <div class="si-score ${scoreClass(d.score?.value)}">
                    ${d.score?.value || 0}/100 • ${d.score?.label || "-"}
                </div>
            </div>

            <!-- 🔥 INSIGHTS -->
            <div class="card">
                <h3>Insights</h3>
                <div class="si-insights">
                    ${
                        (d.insights || []).length
                        ? d.insights.map(i => `
                            <div class="insight ${i.type}">
                                ${i.text}
                            </div>
                        `).join("")
                        : `<div class="insight">No major issues detected</div>`
                    }
                </div>
            </div>

            <!-- KPI GRID -->
            <div class="si-kpi-grid clean">

                ${kpi("Units", d.kpi?.units)}
                ${kpi("Revenue", d.kpi?.revenue)}
                ${kpi("ASP", d.kpi?.asp)}

                ${kpi("Ad Spend", d.kpi?.ad_spend)}
                ${kpi("Ad Revenue", d.kpi?.ad_revenue)}
                ${kpi("ROI", d.kpi?.roi)}

                ${kpi("Impressions", d.kpi?.impressions)}
                ${kpi("Clicks", d.kpi?.clicks)}
                ${kpi("CVR", d.kpi?.cvr)}

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
                    ${box("Impressions", d.traffic?.impressions)}
                    ${arrow()}
                    ${box("Clicks", d.traffic?.clicks)}
                    ${arrow()}
                    ${box("ATC", d.traffic?.atc)}
                    ${arrow()}
                    ${box("Orders", d.traffic?.orders)}
                </div>
            </div>

            <!-- MONTH COMPARISON -->
            <div class="card">
                <h3>Month Comparison</h3>
                <div class="si-compare clean">
                    <div>
                        <span>Current</span>
                        <strong>${fmt(d.comparison?.units)}</strong>
                    </div>
                    <div>
                        <span>Last</span>
                        <strong>${fmt(d.comparison?.last_units)}</strong>
                    </div>
                    <div>
                        <span>Growth</span>
                        <strong class="${growthClass(d.comparison?.growth)}">
                            ${pct(d.comparison?.growth)}
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

    /* =========================
       CHART
    ========================= */

    const trend = d.trend || {};
    const labels = Object.keys(trend);

    if (labels.length){
        const revenue = labels.map(k => trend[k]?.revenue || 0);
        renderLineChart("ddChart", labels, revenue, [], "Revenue", "");
    }
}

/* =========================
   HELPERS
========================= */

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

function safe(v){
    return v || "-";
}

function fmt(n){ return Number(n||0).toLocaleString(); }
function pct(n){ return (n||0).toFixed(1)+"%"; }

function growthClass(n){
    if(n > 0) return "kpi-good";
    if(n < 0) return "kpi-bad";
    return "";
}

function scoreClass(v){
    if (v >= 80) return "kpi-good";
    if (v < 40) return "kpi-bad";
    return "";
}