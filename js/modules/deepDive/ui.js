import { buildStyleIntelligence } from "../styleIntelligence/engine.js";

export function renderDeepDive(){

    const container = document.getElementById("reportContainer");

    container.innerHTML = `
        <div class="card">

            <h3>Deep Dive</h3>

            <div class="top-style-filters compact">

                <input id="ddSearch" class="compact-input" placeholder="Enter Style ID..." />

                <button id="ddSearchBtn" class="compact-btn">Search</button>
                <button id="ddExportBtn" class="compact-btn">Export</button>

            </div>

            <div id="ddResult" style="margin-top:16px;">
                <p style="color:#6b7280;">Search a style to view intelligence</p>
            </div>

        </div>
    `;

    let currentData = null;

    document.getElementById("ddSearchBtn").onclick = runSearch;
    document.getElementById("ddSearch").onkeypress = e=>{
        if (e.key === "Enter") runSearch();
    };

    document.getElementById("ddExportBtn").onclick = ()=>{
        if (!currentData) return alert("Search first");
        exportStyle(currentData);
    };

    function runSearch(){

        const styleId = document.getElementById("ddSearch").value.trim();

        if (!styleId) return alert("Enter style ID");

        const data = buildStyleIntelligence(styleId);

        if (!data || (!data.kpi.units && !data.kpi.revenue)){
            document.getElementById("ddResult").innerHTML =
                `<p style="color:red;">❌ Style not found</p>`;
            return;
        }

        currentData = data;
        renderResult(data);
    }
}

/* ---------- RESULT UI ---------- */

function renderResult(d){

    const el = document.getElementById("ddResult");

    el.innerHTML = `
        <div class="card">

            <h3>${d.style_id} • ${d.brand}</h3>

            <div class="si-kpi-grid">

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

            <div class="card">
                <h3>Traffic Funnel</h3>
                <div class="si-funnel">
                    ${box("Impr", d.traffic.impressions)}
                    → ${box("Clicks", d.traffic.clicks)}
                    → ${box("ATC", d.traffic.atc)}
                    → ${box("Orders", d.traffic.orders)}
                </div>
            </div>

            <div class="card">
                <h3>Month Comparison</h3>
                <div class="si-compare">
                    <div>Current: ${fmt(d.comparison.units)}</div>
                    <div>Last: ${fmt(d.comparison.last_units)}</div>
                    <div class="${growthClass(d.comparison.growth)}">
                        ${pct(d.comparison.growth)}
                    </div>
                </div>
            </div>

            <div class="card">
                <h3>Insights</h3>
                ${(d.insights || []).map(i => `
                    <div class="si-insight ${i.type}">
                        ${i.icon} ${i.text}
                    </div>
                `).join("")}
            </div>

        </div>
    `;
}

/* ---------- EXPORT ---------- */

function exportStyle(d){

    const row = [
        d.style_id,
        d.brand,
        d.kpi.units,
        d.kpi.revenue,
        d.kpi.roi,
        d.kpi.cvr
    ].join(",");

    const csv = "style,brand,units,revenue,roi,cvr\n" + row;

    const blob = new Blob([csv], { type:"text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `style-${d.style_id}.csv`;
    a.click();
}

/* ---------- HELPERS ---------- */

function kpi(t,v){
    return `<div class="si-kpi"><span>${t}</span><strong>${fmt(v)}</strong></div>`;
}

function box(t,v){
    return `<span>${t}: ${fmt(v)}</span>`;
}

function fmt(n){ return Number(n||0).toLocaleString(); }
function pct(n){ return (n||0).toFixed(1)+"%"; }

function growthClass(n){
    if (n > 0) return "kpi-good";
    if (n < 0) return "kpi-bad";
    return "";
}