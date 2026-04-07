import { renderLineChart } from "../../ui/components/charts/lineChart.js";

export function renderStyleIntelligence(data){

    const overlay = document.createElement("div");
    overlay.className = "si-overlay";

    overlay.innerHTML = `
        <div class="si-container">

            <div class="si-header">
                <h2>Style Intelligence</h2>
                <button id="siClose">✕</button>
            </div>

            <div class="si-meta">
                Style: ${data.style_id} | Brand: ${data.brand}
            </div>

            <!-- KPI -->
            <div class="kpi-grid">
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

            <!-- TREND -->
            <div class="card">
                <h3>Sales Trend</h3>
                <canvas id="siChart"></canvas>
            </div>

            <!-- TRAFFIC -->
            <div class="card">
                <h3>Traffic Funnel</h3>
                <p>
                    Impressions: ${fmt(data.traffic.impressions)} |
                    Clicks: ${fmt(data.traffic.clicks)} |
                    ATC: ${fmt(data.traffic.atc)} |
                    Orders: ${fmt(data.traffic.orders)}
                </p>
            </div>

            <!-- COMPARISON -->
            <div class="card">
                <h3>Month Comparison</h3>
                <p>
                    Current: ${fmt(data.comparison.units)} |
                    Last: ${fmt(data.comparison.last_units)} |
                    Growth: ${pct(data.comparison.growth)}
                </p>
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

    // close
    document.getElementById("siClose").onclick = ()=>{
        overlay.remove();
    };
}

function kpi(t,v){
    return `<div class="kpi-card"><h3>${t}</h3><p>${fmt(v)}</p></div>`;
}

function fmt(n){ return Number(n||0).toLocaleString(); }
function pct(n){ return (n||0).toFixed(1)+"%"; }