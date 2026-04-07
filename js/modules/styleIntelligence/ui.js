import { renderLineChart } from "../../ui/components/charts/lineChart.js";

export function renderStyleIntelligence(data){

    const overlay = document.createElement("div");
    overlay.className = "si-overlay";

    overlay.innerHTML = `
        <div class="si-container">

            <!-- HEADER -->
            <div class="si-header">
                <div>
                    <h2>Style Intelligence</h2>
                    <p class="si-sub">
                        ${data.style_id} • ${data.brand}
                    </p>
                </div>
                <button id="siClose">✕</button>
            </div>

            <!-- KPI GRID -->
            <div class="si-kpi-grid">
                ${kpi("Units", data.kpi.units)}
                ${kpi("Revenue", data.kpi.revenue)}
                ${kpi("ASP", data.kpi.asp)}

                ${kpi("Ad Spend", data.kpi.ad_spend)}
                ${kpi("Ad Revenue", data.kpi.ad_revenue)}
                ${kpi("ROI", data.kpi.roi)}

                ${kpi("Impressions", data.kpi.impressions)}
                ${kpi("Clicks", data.kpi.clicks)}
                ${kpi("CVR", data.kpi.cvr)}
            </div>

            <!-- 🔥 INSIGHTS (ADDED) -->
            <div class="card">
                <h3>Insights</h3>
                <div class="si-insights">
                    ${(data.insights || []).map(i => `
                        <div class="si-insight ${i.type}">
                            <span>${i.icon}</span>
                            <p>${i.text}</p>
                        </div>
                    `).join("")}
                </div>
            </div>

            <!-- TREND -->
            <div class="card">
                <h3>Sales Trend</h3>
                <canvas id="siChart"></canvas>
            </div>

            <!-- FUNNEL -->
            <div class="card">
                <h3>Traffic Funnel</h3>
                <div class="si-funnel">
                    ${funnel("Impressions", data.traffic.impressions)}
                    ${arrow()}
                    ${funnel("Clicks", data.traffic.clicks)}
                    ${arrow()}
                    ${funnel("ATC", data.traffic.atc)}
                    ${arrow()}
                    ${funnel("Orders", data.traffic.orders)}
                </div>
            </div>

            <!-- COMPARISON -->
            <div class="card">
                <h3>Month Comparison</h3>
                <div class="si-compare">
                    <div>
                        <span>Current</span>
                        <strong>${fmt(data.comparison.units)}</strong>
                    </div>
                    <div>
                        <span>Last</span>
                        <strong>${fmt(data.comparison.last_units)}</strong>
                    </div>
                    <div>
                        <span>Growth</span>
                        <strong class="${growthClass(data.comparison.growth)}">
                            ${pct(data.comparison.growth)}
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

    document.body.appendChild(overlay);

    // chart
    const labels = Object.keys(data.trend);
    const values = labels.map(d=>data.trend[d].revenue);

    renderLineChart("siChart", labels, values, [], "Revenue", "");

    document.getElementById("siClose").onclick = ()=>{
        overlay.remove();
    };
}

/* ---------- UI BLOCKS ---------- */

function kpi(t,v){
    return `
        <div class="si-kpi">
            <span>${t}</span>
            <strong>${fmt(v)}</strong>
        </div>
    `;
}

function funnel(t,v){
    return `
        <div class="si-funnel-box">
            <span>${t}</span>
            <strong>${fmt(v)}</strong>
        </div>
    `;
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