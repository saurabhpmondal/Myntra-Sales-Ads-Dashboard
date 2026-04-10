import { buildSJITPlanning } from "./engine.js";

let FULL_DATA = [];
let visibleCount = 50;

export function renderSJITPlanning(){

    const container = document.getElementById("reportContainer");

    FULL_DATA = buildSJITPlanning()
        .sort((a,b) => (b.shipment || 0) - (a.shipment || 0)); // 🔥 SORT

    visibleCount = 50;

    renderTable();
}

/* ========================= */

function renderTable(){

    const container = document.getElementById("reportContainer");

    const data = FULL_DATA.slice(0, visibleCount);

    const rows = data.map(r => {

        const returnFlag = r.return_pct > 0.4 ? "HIGH RETURN" : "";

        return `
        <tr>
            <td>${r.style_id}</td>
            <td>${r.brand || "-"}</td>
            <td>${r.erp_sku || "-"}</td>
            <td>${r.status || "-"}</td>
            <td>${fmt2(r.rating)}</td>

            <td>${r.gross}</td>
            <td>${r.return}</td>
            <td class="${r.return_pct > 0.4 ? "red" : ""}">
                ${pct(r.return_pct)} ${returnFlag}
            </td>
            <td>${r.net}</td>

            <td>${fmt2(r.drr)}</td>
            <td>${r.sjit}</td>
            <td>${fmt2(r.sc)}</td>

            <td class="green">${r.shipment}</td>
            <td class="red">${r.recall}</td>

            <td>${r.priority}</td>
            <td>${r.action}</td>
            <td class="${r.remark === "HIGH RISK" ? "red" : ""}">
                ${r.remark}
            </td>
        </tr>
    `}).join("");

    container.innerHTML = `
        <div class="card table-card">

            <h3>SJIT PO Planning</h3>

            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">

                <button onclick="downloadSJIT()">Export</button>

                <input id="sjitSearch" placeholder="Search Style..." oninput="searchSJIT(this.value)" />

            </div>

            <div class="table-wrapper">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Style</th>
                            <th>Brand</th>
                            <th>ERP</th>
                            <th>Status</th>
                            <th>Rating</th>

                            <th>Gross</th>
                            <th>Return</th>
                            <th>Return%</th>
                            <th>Net</th>

                            <th>DRR</th>
                            <th>SJIT</th>
                            <th>SC</th>

                            <th>Shipment</th>
                            <th>Recall</th>

                            <th>Priority</th>
                            <th>Action</th>
                            <th>Remark</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>

            ${
                visibleCount < FULL_DATA.length
                ? `<div style="text-align:center; margin-top:10px;">
                        <button onclick="loadMoreSJIT()">Load More</button>
                   </div>`
                : ""
            }

        </div>
    `;
}

/* ========================= */
/* LOAD MORE */

window.loadMoreSJIT = function(){
    visibleCount += 50;
    renderTable();
};

/* ========================= */
/* SEARCH */

window.searchSJIT = function(val){

    val = val.toLowerCase();

    const filtered = FULL_DATA.filter(r =>
        (r.style_id || "").toLowerCase().includes(val)
    );

    visibleCount = 50;

    FULL_DATA = filtered;
    renderTable();
};

/* ========================= */
/* EXPORT (FULL DATA SAFE) */

window.downloadSJIT = function(){

    let csv = Object.keys(FULL_DATA[0]).join(",") + "\n";

    FULL_DATA.forEach(r => {
        csv += Object.values(r).join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "sjit_planning.csv";
    a.click();
};

/* ========================= */

function fmt2(n){ return Number(n||0).toFixed(2); }
function pct(n){ return ((n||0)*100).toFixed(1)+"%"; }