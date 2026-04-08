import { buildStyleIntelligence } from "../styleIntelligence/engine.js";
import { renderStyleIntelligence } from "../styleIntelligence/ui.js";

export function renderDeepDive(){

    const container = document.getElementById("reportContainer");

    container.innerHTML = `
        <div class="card">

            <h3>Deep Dive</h3>

            <div class="top-style-filters">

                <div class="filter-item search-box">
                    <input id="ddSearch" placeholder="Enter Style ID..." />
                </div>

                <div class="filter-item">
                    <button id="ddSearchBtn">Search</button>
                </div>

                <div class="filter-item">
                    <button id="ddExportBtn">Export Style</button>
                </div>

            </div>

            <div id="ddResult" style="margin-top:16px;">
                <p style="color:#6b7280;">Search a style to view intelligence</p>
            </div>

        </div>
    `;

    let currentData = null;

    document.getElementById("ddSearchBtn").onclick = ()=>{
        runSearch();
    };

    document.getElementById("ddSearch").onkeypress = (e)=>{
        if (e.key === "Enter") runSearch();
    };

    document.getElementById("ddExportBtn").onclick = ()=>{
        if (!currentData){
            alert("Search a style first");
            return;
        }

        exportStyle(currentData);
    };

    function runSearch(){

        const styleId = document.getElementById("ddSearch").value.trim();

        if (!styleId){
            alert("Enter style ID");
            return;
        }

        const data = buildStyleIntelligence(styleId);

        // ❌ STYLE NOT FOUND
        if (!data || (!data.kpi.units && !data.kpi.revenue)){
            document.getElementById("ddResult").innerHTML = `
                <p style="color:red;">❌ Style not found</p>
            `;
            currentData = null;
            return;
        }

        currentData = data;

        document.getElementById("ddResult").innerHTML = "";
        renderStyleIntelligenceInline(data);
    }
}

/* ---------- INLINE RENDER ---------- */

function renderStyleIntelligenceInline(data){

    const container = document.getElementById("ddResult");

    container.innerHTML = `
        <div class="card">

            <h3>${data.style_id} • ${data.brand}</h3>

            <div class="si-kpi-grid">
                ${kpi("Units", data.kpi.units)}
                ${kpi("Revenue", data.kpi.revenue)}
                ${kpi("ASP", data.kpi.asp)}
                ${kpi("ROI", data.kpi.roi)}
                ${kpi("CVR", data.kpi.cvr)}
            </div>

            <div class="card">
                <h3>Insights</h3>
                ${(data.insights || []).map(i => `
                    <div class="si-insight ${i.type}">
                        ${i.icon} ${i.text}
                    </div>
                `).join("")}
            </div>

        </div>
    `;
}

/* ---------- EXPORT ---------- */

function exportStyle(data){

    const row = {
        style_id: data.style_id,
        brand: data.brand,
        units: data.kpi.units,
        revenue: data.kpi.revenue,
        asp: data.kpi.asp,
        roi: data.kpi.roi,
        cvr: data.kpi.cvr
    };

    const headers = Object.keys(row);

    const csv = [
        headers.join(","),
        headers.map(h => row[h]).join(",")
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `style-${data.style_id}.csv`;
    a.click();

    URL.revokeObjectURL(url);
}

/* ---------- HELPERS ---------- */

function kpi(t,v){
    return `<div class="si-kpi"><span>${t}</span><strong>${fmt(v)}</strong></div>`;
}

function fmt(n){ return Number(n||0).toLocaleString(); }