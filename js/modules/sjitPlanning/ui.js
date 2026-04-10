import { buildSJITPlanning } from "./engine.js";

export function renderSJITPlanning(){

    const container = document.getElementById("reportContainer");

    const data = buildSJITPlanning();

    const rows = data.map(r => `
        <tr>
            <td>${r.style_id}</td>
            <td>${r.brand || "-"}</td>
            <td>${r.erp_sku || "-"}</td>
            <td>${r.status || "-"}</td>
            <td>${fmt2(r.rating)}</td>

            <td>${r.gross}</td>
            <td>${r.return}</td>
            <td>${pct(r.return_pct)}</td>
            <td>${r.net}</td>

            <td>${fmt2(r.drr)}</td>
            <td>${r.sjit}</td>
            <td>${fmt2(r.sc)}</td>

            <td class="green">${r.shipment}</td>
            <td class="red">${r.recall}</td>

            <td>${r.priority}</td>
            <td>${r.action}</td>
            <td>${r.remark}</td>
        </tr>
    `).join("");

    container.innerHTML = `
        <div class="card table-card">

            <h3>SJIT PO Planning</h3>

            <div style="text-align:right; margin-bottom:8px;">
                <input id="sjitSearch" placeholder="Search Style..." />
                <button onclick="downloadSJIT()">Export</button>
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

        </div>
    `;
}

/* ========================= */

function fmt2(n){ return Number(n||0).toFixed(2); }
function pct(n){ return ((n||0)*100).toFixed(1)+"%"; }

/* ========================= */
/* EXPORT */

window.downloadSJIT = function(){

    const data = buildSJITPlanning();

    let csv = Object.keys(data[0]).join(",") + "\n";

    data.forEach(r => {
        csv += Object.values(r).join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "sjit_planning.csv";
    a.click();
};