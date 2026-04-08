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
                        </tr>
                    </thead>
                    <tbody id="topStylesBody"></tbody>
                </table>
            </div>

        </div>
    `;

    // 🔥 CLICK HANDLER (STABLE)
    document.getElementById("topStylesBody").onclick = function(e){

        const cell = e.target.closest(".clickable-style");
        if (!cell) return;

        const styleId = cell.dataset.style;

        openStyleIntelligence(styleId);
    };

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
}

/* ---------- RENDER ---------- */

function renderRows(data){

    let filtered = data;

    if (currentBrand !== "ALL"){
        filtered = filtered.filter(d => d.brand === currentBrand);
    }

    if (searchText){
        filtered = filtered.filter(d =>
            String(d.style_id).toLowerCase().includes(searchText)
        );
    }

    const rows = filtered
        .slice(0, currentLimit)
        .map(r => `
            <tr>
                <td class="clickable-style" data-style="${r.style_id}">
                    ${r.style_id}
                </td>
                <td>${r.brand}</td>
                <td>${fmt(r.units)}</td>
                <td>${fmt(r.revenue)}</td>
                <td>${fmt(r.last_units)}</td>
                <td>${fmt(r.last_revenue)}</td>
                <td class="${growthClass(r.growth)}">${pct(r.growth)}</td>
                <td class="${r.className}">${r.remark}</td>
            </tr>
        `).join("");

    document.getElementById("topStylesBody").innerHTML = rows;
}

/* ---------- HELPERS ---------- */

function opt(n){
    return `<option value="${n}" ${n===10?"selected":""}>${n}</option>`;
}

function fmt(n){ return Number(n||0).toLocaleString(); }
function pct(n){ return (n||0).toFixed(1)+"%"; }

function growthClass(n){
    if (n > 0) return "kpi-good";
    if (n < 0) return "kpi-bad";
    return "";
}