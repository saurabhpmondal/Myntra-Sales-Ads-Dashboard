import { openStyleIntelligence } from "../styleIntelligence/binder.js";

let currentLimit = 10;
let currentBrand = "ALL";
let searchText = "";

export function renderTopStyles(data){

    const container = document.getElementById("reportContainer");
    const brands = [...new Set(data.map(d => d.brand).filter(Boolean))];

    container.innerHTML = `
        <div class="card table-card">

            <h3>Top Styles</h3>

            <div class="top-style-filters">

                <div class="filter-item search-box">
                    <input id="styleSearch" placeholder="Search style..." />
                </div>

                <div class="filter-item">
                    <select id="brandSelect">
                        <option value="ALL">All Brands</option>
                        ${brands.map(b => `<option value="${b}">${b}</option>`).join("")}
                    </select>
                </div>

                <div class="filter-item small">
                    <select id="topNSelect">
                        ${opt(10)}${opt(20)}${opt(50)}${opt(100)}
                    </select>
                </div>

                <div class="filter-item">
                    <button id="exportTop50Btn" type="button">Export Top 50</button>
                </div>

            </div>

            <div class="table-wrapper">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Style</th>
                            <th>Brand</th>
                            <th>Units</th>
                            <th>Revenue</th>
                            <th>Last Units</th>
                            <th>Last Revenue</th>
                            <th>% Growth</th>
                            <th>Remark</th>
                            <th>🔍</th>
                        </tr>
                    </thead>
                    <tbody id="topStylesBody"></tbody>
                </table>
            </div>

        </div>
    `;

    renderRows(data);

    document.getElementById("topNSelect").onchange = e=>{
        currentLimit = Number(e.target.value);
        renderRows(data);
    };

    document.getElementById("brandSelect").onchange = e=>{
        currentBrand = e.target.value;
        renderRows(data);
    };

    document.getElementById("styleSearch").oninput = e=>{
        searchText = e.target.value.toLowerCase();
        renderRows(data);
    };

    document.getElementById("exportTop50Btn").onclick = ()=>{
        exportTop50(data);
    };
}

/* ---------- RENDER ---------- */

function renderRows(data){

    const filtered = getFilteredData(data);

    const rows = filtered
        .slice(0, currentLimit)
        .map(r => `
            <tr>
                <td>${r.style_id}</td>
                <td>${r.brand}</td>
                <td>${fmt(r.units)}</td>
                <td>${fmt(r.revenue)}</td>
                <td>${fmt(r.last_units)}</td>
                <td>${fmt(r.last_revenue)}</td>
                <td class="${growthClass(r.growth)}">${pct(r.growth)}</td>
                <td class="${r.className}">${r.remark}</td>
                <td class="deep-dive-btn" data-style="${r.style_id}">🔍</td>
            </tr>
        `).join("");

    document.getElementById("topStylesBody").innerHTML = rows;

    document.querySelectorAll(".deep-dive-btn").forEach(el=>{
        el.onclick = function(){
            const styleId = this.dataset.style;
            openStyleIntelligence(styleId);
        };
    });
}

/* ---------- FILTER ---------- */

function getFilteredData(data){

    let filtered = [...data];

    if (currentBrand !== "ALL"){
        filtered = filtered.filter(d => d.brand === currentBrand);
    }

    if (searchText){
        filtered = filtered.filter(d =>
            String(d.style_id).toLowerCase().includes(searchText)
        );
    }

    return filtered;
}

/* ---------- EXPORT ---------- */

function exportTop50(data){

    const filtered = getFilteredData(data).slice(0, 50);

    if (!filtered.length){
        alert("No styles available to export.");
        return;
    }

    const rows = filtered.map(r => ({
        style_id: r.style_id,
        brand: r.brand,
        units: safe(r.units),
        revenue: safe(r.revenue),
        last_units: safe(r.last_units),
        last_revenue: safe(r.last_revenue),
        growth_percent: Number(r.growth || 0).toFixed(1),
        remark: r.remark || ""
    }));

    const headers = Object.keys(rows[0]);
    const csv = [
        headers.join(","),
        ...rows.map(row =>
            headers.map(h => csvCell(row[h])).join(",")
        )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = buildFileName();
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
}

function buildFileName(){
    const brandPart = currentBrand === "ALL" ? "all-brands" : slug(currentBrand);
    return `top-50-styles-${brandPart}.csv`;
}

function csvCell(value){
    const text = String(value ?? "");
    if (text.includes(",") || text.includes('"') || text.includes("\n")){
        return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
}

function slug(text){
    return String(text || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}

/* ---------- HELPERS ---------- */

function opt(n){
    return `<option value="${n}" ${n===10?"selected":""}>${n}</option>`;
}

function safe(n){
    return Number(n || 0);
}

function fmt(n){ return Number(n||0).toLocaleString(); }
function pct(n){ return Number(n||0).toFixed(1)+"%"; }

function growthClass(n){
    if (n > 0) return "kpi-good";
    if (n < 0) return "kpi-bad";
    return "";
}