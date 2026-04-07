import { buildPlacementData } from "./engine.js";

export function renderPlacement() {

    const data = buildPlacementData();

    const container = document.getElementById("reportContainer");

    if (!Object.keys(data).length) {
        container.innerHTML = `<div style="padding:20px">No Placement Data</div>`;
        return;
    }

    const rows = Object.entries(data).map(([p,r]) => `
        <tr>
            <td>${p}</td>

            <td>${fmt(r.impressions)}</td>
            <td>${fmt(r.clicks)}</td>
            <td>${pct(r.ctr)}</td>
            <td>${pct(r.cvr)}</td>
            <td>${fmt2(r.cpc)}</td>

            <td>${fmt(r.direct_units)}</td>
            <td>${fmt(r.indirect_units)}</td>
            <td>${fmt(r.total_units)}</td>

            <td>${fmt(r.direct_rev)}</td>
            <td>${fmt(r.indirect_rev)}</td>
            <td>${fmt(r.total_rev)}</td>

            <td>${fmt(r.spend)}</td>
            <td>${fmt2(r.roi)}</td>
        </tr>
    `).join("");

    container.innerHTML = `
        <div class="card table-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th>Placement</th>

                        <th>Imp</th>
                        <th>Clicks</th>
                        <th>CTR</th>
                        <th>CVR</th>
                        <th>CPC</th>

                        <th>D Units</th>
                        <th>I Units</th>
                        <th>Total</th>

                        <th>D Rev</th>
                        <th>I Rev</th>
                        <th>Total</th>

                        <th>Spend</th>
                        <th>ROI</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

/* ---------- FORMAT ---------- */

function fmt(n){ return Number(n||0).toLocaleString(); }
function fmt2(n){ return Number(n||0).toFixed(2); }
function pct(n){ return ((n||0)*100).toFixed(2)+"%"; }