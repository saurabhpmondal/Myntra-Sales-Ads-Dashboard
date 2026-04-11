import { buildSJITPlanning } from "./engine.js";

let FULL_DATA = [];
let ORIGINAL_DATA = [];
let visibleCount = 50;
let debounceTimer = null;

export function renderSJITPlanning(){

    const container = document.getElementById("reportContainer");

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
        let remarks = [];

        const status = (r.status || "").toLowerCase();

        if (status === "discontinued"){
            shipment = 0;
            remarks.push("DO NOT SHIP");
        }

        if (status === "special"){
            shipment = 0;
            remarks.push("SPECIAL");
        }

        if (r.return_pct > 0.45){
            remarks.push("HIGH RETURN");
        }

        const isRecall = r.sc >= 90;
        if (isRecall){
            remarks.push("RECALL");
        }

        if (r.remark){
            remarks.push(r.remark);
        }

        const finalRemark = remarks.join(" | ") || "-";

        return `
        <tr class="${isRecall ? "row-recall" : ""}">
            <td>
                ${r.style_id 
                    ? `<a href="https://www.myntra.com/${r.style_id}" target="_blank" class="style-link">${r.style_id}</a>` 
                    : "-"}
            </td>
            <td>${r.brand || "-"}</td>
            <td>${r.erp_sku || "-"}</td>
            <td>${r.status || "-"}</td>
            <td>${fmt2(r.rating)}</td>

            <td>${r.gross}</td>
            <td>${r.return}</td>
            <td class="${r.return_pct > 0.45 ? "high-return" : ""}">
                ${pct(r.return_pct)}
            </td>
            <td>${r.net}</td>

            <td>${fmt2(r.drr)}</td>
            <td>${r.sjit}</td>
            <td>${fmt2(r.sc)}</td>

            <td class="green">${Math.round(shipment)}</td>
            <td class="red">${Math.round(r.recall)}</td>

            <td>${finalRemark}</td>
        </tr>
    `;
    }).join("");

    container.innerHTML = `
        <div class="card table-card">

            <h3>SJIT PO Planning</h3>

            <div style="display:flex; justify-content:flex-end; gap:10px; margin-bottom:10px;">
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

                            <th>Gross (U)</th>
                            <th>Return (U)</th>
                            <th>Return%</th>
                            <th>Net (U)</th>

                            <th>DRR</th>
                            <th>SJIT STOCK</th>
                            <th>SC</th>

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
                ? `<div style="text-align:center; margin-top:10px;">
                        <button onclick="loadMoreSJIT()">Load More</button>
                   </div>`
                : ""
            }

        </div>
    `;

    bindSearch();
}

/* ========================= */
/* 🔥 SEARCH WITH DEBOUNCE */

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
                    (r.style_id || "").toLowerCase().includes(val)
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
/* 🔥 FIXED EXPORT */

window.downloadSJIT = function(){

    const data = ORIGINAL_DATA;

    const headers = [
        "Style ID","Brand","ERP SKU","ERP Status","Rating",
        "Gross","Return","Return%","Net",
        "DRR","SJIT STOCK","SC",
        "Shipment QTY","Recall QTY","Remarks"
    ];

    let csv = headers.join(",") + "\n";

    data.forEach(r => {

        let shipment = r.shipment;
        let remarks = [];

        const status = (r.status || "").toLowerCase();

        if (status === "discontinued"){
            shipment = 0;
            remarks.push("DO NOT SHIP");
        }

        if (status === "special"){
            shipment = 0;
            remarks.push("SPECIAL");
        }

        if (r.return_pct > 0.45){
            remarks.push("HIGH RETURN");
        }

        const isRecall = r.sc >= 90;
        if (isRecall){
            remarks.push("RECALL");
        }

        if (r.remark){
            remarks.push(r.remark);
        }

        const finalRemark = remarks.join(" | ") || "-";

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

            fmt2(r.drr),
            r.sjit,
            fmt2(r.sc),

            Math.round(shipment),
            Math.round(r.recall),

            `"${finalRemark}"`
        ].join(",") + "\n";

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