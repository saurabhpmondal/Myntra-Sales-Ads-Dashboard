export function renderPlacement(data){

    const container = document.getElementById("reportContainer");

    /* =========================
       EXISTING TABLE (UNCHANGED)
    ========================= */

    const rows = Object.entries(data)
        .filter(([k]) => k !== "_campaignPlacement")
        .map(([name,r]) => `
        <tr>
            <td>${name}</td>
            <td>${fmt(r.impressions)}</td>
            <td>${fmt(r.clicks)}</td>
            <td>${pct(r.ctr)}</td>
            <td>${fmt(r.units)}</td>
            <td>${fmt(r.revenue)}</td>
            <td>${fmt(r.spend)}</td>
            <td>${fmt2(r.roi)}</td>
        </tr>
    `).join("");

    /* =========================
       NEW TABLE
    ========================= */

    const cp = data._campaignPlacement || {};

    let cpRows = "";

    Object.entries(cp).forEach(([campaign, placements]) => {

        const bestROI = Math.max(...placements.map(p => p.roi));

        placements.forEach((r, i) => {

            cpRows += `
                <tr class="${r.roi === bestROI ? "kpi-good" : ""}">
                    <td>${i === 0 ? campaign : ""}</td>
                    <td>${r.placement}</td>
                    <td>${fmt(r.spend)}</td>
                    <td>${fmt(r.impressions)}</td>
                    <td>${fmt(r.clicks)}</td>
                    <td>${pct(r.ctr)}</td>
                    <td>${pct(r.cvr)}</td>
                    <td>${fmt(r.units)}</td>
                    <td>${fmt(r.revenue)}</td>
                    <td>${fmt2(r.roi)}</td>
                </tr>
            `;
        });
    });

    container.innerHTML = `
        <div class="card table-card">
            <h3>Placement Performance</h3>
            <div class="table-wrapper">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Placement</th>
                            <th>Impressions</th>
                            <th>Clicks</th>
                            <th>CTR</th>
                            <th>Units</th>
                            <th>Revenue</th>
                            <th>Spend</th>
                            <th>ROI</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>

        <div class="card table-card">
            <h3>Campaign × Placement</h3>
            <div class="table-wrapper">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Campaign</th>
                            <th>Placement</th>
                            <th>Spend</th>
                            <th>Impressions</th>
                            <th>Clicks</th>
                            <th>CTR</th>
                            <th>CVR</th>
                            <th>Units</th>
                            <th>Revenue</th>
                            <th>ROI</th>
                        </tr>
                    </thead>
                    <tbody>${cpRows}</tbody>
                </table>
            </div>
        </div>
    `;
}

function fmt(n){ return Number(n||0).toLocaleString(); }
function fmt2(n){ return Number(n||0).toFixed(2); }
function pct(n){ return ((n||0)*100).toFixed(2)+"%"; }