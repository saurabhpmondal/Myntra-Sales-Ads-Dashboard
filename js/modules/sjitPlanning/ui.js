import { buildSJIOPlanning } from "./engine.js";

export function renderSJIOPlanning(){

    const container = document.getElementById("reportContainer");

    const data = buildSJIOPlanning() || [];

    let visibleCount = 50;

    render();

    function render(){

        const rows = data.slice(0, visibleCount).map(r => {

            const recallClass = r.recall === "YES" ? "row-recall" : "";

            return `
                <tr class="${recallClass}">
                    <td>${r.style_id}</td>
                    <td>${r.brand}</td>
                    <td>${r.erp_sku}</td>
                    <td>${r.status}</td>
                    <td>${fmt2(r.rating)}</td>

                    <td>${fmt(r.gross)}</td>
                    <td>${fmt(r.returns)}</td>
                    <td class="${r.returnPct > 45 ? "high-return" : ""}">
                        ${pct(r.returnPct)}
                    </td>

                    <td>${fmt(r.net)}</td>
                    <td>${fmt2(r.drr)}</td>

                    <td>${fmt(r.sjit)}</td>
                    <td>${fmt2(r.sc)}</td>

                    <td>${fmt(r.shipment)}</td>
                    <td>${r.recall}</td>

                    <td>${r.remark || "-"}</td>
                </tr>
            `;
        }).join("");

        container.innerHTML = `
            <div class="card table-card">

                <h3>SJIO PO Planning</h3>

                <!-- 🔥 ACTION BAR -->
                <div class="table-actions">
                    <button id="exportBtn">Export</button>
                    <input id="searchBox" placeholder="Search Style ID..." />
                </div>

                <div class="table-wrapper">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Style ID</th>
                                <th>Brand</th>
                                <th>ERP SKU</th>
                                <th>ERP Status</th>
                                <th>Ratings</th>

                                <th>Gross</th>
                                <th>Return</th>
                                <th>Return %</th>

                                <th>Net</th>
                                <th>DRR</th>

                                <th>SJIT Stock</th>
                                <th>SC</th>

                                <th>Shipment</th>
                                <th>Recall</th>

                                <th>Remark</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows || `<tr><td colspan="15">No Data</td></tr>`}
                        </tbody>
                    </table>
                </div>

                ${
                    visibleCount < data.length
                    ? `<div style="text-align:center; padding:12px;">
                        <button id="loadMore">Load More</button>
                       </div>`
                    : ""
                }

            </div>
        `;

        bindActions();
    }

    /* =========================
       🔥 ACTIONS
    ========================= */

    function bindActions(){

        const loadMoreBtn = document.getElementById("loadMore");
        if (loadMoreBtn){
            loadMoreBtn.onclick = ()=>{
                visibleCount += 50;
                render();
            };
        }

        const search = document.getElementById("searchBox");
        if (search){
            search.oninput = ()=>{
                const val = search.value.trim();

                if (!val){
                    visibleCount = 50;
                    render();
                    return;
                }

                const filtered = data.filter(r =>
                    r.style_id.includes(val)
                );

                renderFiltered(filtered);
            };
        }

        const exportBtn = document.getElementById("exportBtn");
        if (exportBtn){
            exportBtn.onclick = exportCSV;
        }
    }

    function renderFiltered(list){

        const rows = list.map(r => {

            const recallClass = r.recall === "YES" ? "row-recall" : "";

            return `
                <tr class="${recallClass}">
                    <td>${r.style_id}</td>
                    <td>${r.brand}</td>
                    <td>${r.erp_sku}</td>
                    <td>${r.status}</td>
                    <td>${fmt2(r.rating)}</td>

                    <td>${fmt(r.gross)}</td>
                    <td>${fmt(r.returns)}</td>
                    <td class="${r.returnPct > 45 ? "high-return" : ""}">
                        ${pct(r.returnPct)}
                    </td>

                    <td>${fmt(r.net)}</td>
                    <td>${fmt2(r.drr)}</td>

                    <td>${fmt(r.sjit)}</td>
                    <td>${fmt2(r.sc)}</td>

                    <td>${fmt(r.shipment)}</td>
                    <td>${r.recall}</td>

                    <td>${r.remark || "-"}</td>
                </tr>
            `;
        }).join("");

        container.querySelector("tbody").innerHTML =
            rows || `<tr><td colspan="15">No Data</td></tr>`;
    }

    /* =========================
       🔥 EXPORT (FULL DATA)
    ========================= */

    function exportCSV(){

        let csv = `Style ID,Brand,ERP SKU,ERP Status,Ratings,Gross,Return,Return %,Net,DRR,SJIT Stock,SC,Shipment,Recall,Remark\n`;

        data.forEach(r=>{
            csv += `${r.style_id},${r.brand},${r.erp_sku},${r.status},${fmt2(r.rating)},${r.gross},${r.returns},${pct(r.returnPct)},${r.net},${fmt2(r.drr)},${r.sjit},${fmt2(r.sc)},${r.shipment},${r.recall},"${r.remark}"\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "SJIO_PO_Planning.csv";
        a.click();
    }
}

/* =========================
   🔧 HELPERS
========================= */

function fmt(n){ return Number(n||0).toLocaleString(); }
function fmt2(n){ return Number(n||0).toFixed(2); }
function pct(n){ return (n||0).toFixed(1) + "%"; }