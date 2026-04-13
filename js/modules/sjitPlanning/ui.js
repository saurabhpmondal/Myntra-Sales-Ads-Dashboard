// reports/sjitPlanning/ui.js

import { buildSJITPlanning } from "./engine.js";

let FULL_DATA = [];
let ORIGINAL_DATA = [];
let visibleCount = 50;
let debounceTimer = null;

export function renderSJITPlanning(){

    setTimeout(() => {

        FULL_DATA = (buildSJITPlanning() || [])
            .filter(r => r.style_id && !isNaN(r.style_id))
            .sort((a,b) => (b.shipment || 0) - (a.shipment || 0));

        ORIGINAL_DATA = [...FULL_DATA];

        visibleCount = 50;

        renderTable();

    }, 0);
}

/* ========================= */

function renderTable(){

    const container = document.getElementById("reportContainer");

    const data = FULL_DATA.slice(0, visibleCount);

    const rows = data.map(r => {

        let shipment = r.shipment;
        let recall = r.recall;

        const status = (r.status || "").toLowerCase();

        let remarks = [];

        /* =========================
           REMARK SYSTEM
        ========================= */

        if (
            status.includes("discontinue") ||
            status.includes("special") ||
            status.includes("clearance")
        ){
            shipment = 0;
            recall = r.sjit;
            remarks.push("Not Continue Style");
        }

        if (r.return_pct > 0.45){
            remarks.push("High Return");
        }
        else if (r.return_pct > 0.35){
            remarks.push("Risk of High Return");
        }

        if (Number(r.rating || 0) > 0 && Number(r.rating) < 4){
            remarks.push("Low Ratings");
        }

        if (
            remarks.length === 0 &&
            r.return_pct < 0.35 &&
            Number(r.rating || 0) >= 4
        ){
            remarks.push("NO RISK");
        }

        const finalRemark = remarks.join(" | ");

        const isRecall = recall > 0;

        return `
        <tr class="${isRecall ? "row-recall" : ""}">
            <td>
                <a href="https://www.myntra.com/${r.style_id}" target="_blank" class="style-link">
                    ${r.style_id}
                </a>
            </td>

            <td>${r.brand || "-"}</td>
            <td>${r.erp_sku || "-"}</td>
            <td>${r.status || "-"}</td>
            <td>${fmt2(r.rating)}</td>

            <td>${r.gross}</td>
            <td>${r.return}</td>
            <td class="${r.return_pct > 0.35 ? "high-return" : ""}">
                ${pct(r.return_pct)}
            </td>
            <td>${r.net}</td>

            <td>${pct(r.ppmp_share)}</td>
            <td>${pct(r.sjit_share)}</td>
            <td>${r.zone}</td>

            <td>${fmt2(r.sc)}</td>
            <td>${r.sjit}</td>
            <td>${fmt2(r.drr)}</td>

            <td class="green">${shipment}</td>
            <td class="red">${recall}</td>

            <td>${finalRemark}</td>
        </tr>
        `;
    }).join("");

    container.innerHTML = `
        <div class="card table-card">

            <h3>SJIT PO Planning</h3>

            <div style="display:flex;justify-content:flex-end;gap:10px;margin-bottom:10px;">
                <input id="sjitSearch" placeholder="Search Style..." />
                <button onclick="downloadSJIT()">Export</button>
            </div>

            <div class="table-wrapper">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Style ID</th>
                            <th>Brand</th>
                            <th>ERP SKU</th>
                            <th>ERP Status</th>
                            <th>Rating</th>

                            <th>Gross</th>
                            <th>Return</th>
                            <th>Return%</th>
                            <th>Net</th>

                            <th>PPMP Share</th>
                            <th>SJIT Share</th>
                            <th>Zone</th>

                            <th>PDS</th>
                            <th>SJIT STOCK</th>
                            <th>DRR</th>

                            <th>Shipment QTY</th>
                            <th>Recall QTY</th>

                            <th>Remarks</th>
                        </tr>
                    </thead>

                    <tbody>${rows}</tbody>
                </table>
            </div>

            ${
                visibleCount < FULL_DATA.length
                ? `
                <div style="text-align:center;margin-top:10px;">
                    <button onclick="loadMoreSJIT()">Load More</button>
                </div>
                `
                : ""
            }

        </div>
    `;

    bindSearch();
}

/* ========================= */

function bindSearch(){

    const input = document.getElementById("sjitSearch");

    if (!input) return;

    input.oninput = function(){

        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {

            const val = input.value.toLowerCase();

            if (!val){
                FULL_DATA = [...ORIGINAL_DATA];
            } else {
                FULL_DATA = ORIGINAL_DATA.filter(r =>
                    String(r.style_id).toLowerCase().includes(val)
                );
            }

            visibleCount = 50;
            renderTable();

        }, 300);
    };
}

/* ========================= */

window.loadMoreSJIT = function(){
    visibleCount += 50;
    renderTable();
};

/* ========================= */

window.downloadSJIT = function(){

    const data = ORIGINAL_DATA;

    const headers = [
        "Style ID","Brand","ERP SKU","ERP Status","Rating",
        "Gross","Return","Return%","Net",
        "PPMP Share","SJIT Share","Zone",
        "PDS","SJIT STOCK","DRR",
        "Shipment QTY","Recall QTY","Remarks"
    ];

    let csv = headers.join(",") + "\n";

    data.forEach(r => {

        let shipment = r.shipment;
        let recall = r.recall;

        const status = (r.status || "").toLowerCase();

        let remarks = [];

        if (
            status.includes("discontinue") ||
            status.includes("special") ||
            status.includes("clearance")
        ){
            shipment = 0;
            recall = r.sjit;
            remarks.push("Not Continue Style");
        }

        if (r.return_pct > 0.45){
            remarks.push("High Return");
        }
        else if (r.return_pct > 0.35){
            remarks.push("Risk of High Return");
        }

        if (Number(r.rating || 0) > 0 && Number(r.rating) < 4){
            remarks.push("Low Ratings");
        }

        if (
            remarks.length === 0 &&
            r.return_pct < 0.35 &&
            Number(r.rating || 0) >= 4
        ){
            remarks.push("NO RISK");
        }

        csv += [
            r.style_id,
            r.brand || "-",
            r.erp_sku || "-",
            r.status || "-",
            fmt2(r.rating),

            r.gross,
            r.return,
            pct(r.return_pct),
            r.net,

            pct(r.ppmp_share),
            pct(r.sjit_share),
            r.zone,

            fmt2(r.sc),
            r.sjit,
            fmt2(r.drr),

            shipment,
            recall,

            `"${remarks.join(" | ")}"`
        ].join(",") + "\n";
    });

    const blob = new Blob([csv], { type:"text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "sjit_planning.csv";
    a.click();
};

/* ========================= */

function fmt2(n){
    return Number(n || 0).toFixed(2);
}

function pct(n){
    return ((n || 0) * 100).toFixed(1) + "%";
}