export function renderPlacement(data){

    const container = document.getElementById("reportContainer");

    /* =========================
       ✅ EXISTING PLACEMENT TABLE
    ========================= */

    const placementData = data.placement || {};

    const rows = Object.entries(placementData).map(([name,r]) => `
        <tr>
            <td>${name}</td>
            <td>${fmt(r.impressions)}</td>
            <td>${fmt(r.clicks)}</td>
            <td>${pct(r.ctr)}</td>
            <td>${fmt(r.total_units)}</td>
            <td>${fmt(r.revenue)}</td>
            <td>${fmt(r.spend)}</td>
            <td>${fmt2(r.roi)}</td>
        </tr>
    `).join("");

    /* =========================
       🔥 CAMPAIGN × PLACEMENT TABLE
    ========================= */

    const cpData = data.campaignPlacement || [];

    let cpRows = "";

    cpData.forEach(([campaign, placements]) => {

        const bestROI = Math.max(...placements.map(p => p.roi));

        placements.forEach((r, idx) => {

            const isBest = r.roi === bestROI;

            // 🔥 SIMPLE SUGGESTION (SAFE)
            let suggestion = "⚖️ Stable";
            if (r.roi >= 3) suggestion = "🚀 Scale";
            else if (r.roi < 1 && r.spend > 1000) suggestion = "❌ Cut";

            cpRows += `
                <tr class="${isBest ? "kpi-good" : ""}">
                    <td>${idx === 0 ? campaign : ""}</td>
                    <td>${r.placement}</td>
                    <td>${fmt(r.spend)}</td>
                    <td>${fmt(r.impressions)}</td>
                    <td>${fmt(r.clicks)}</td>
                    <td>${pct(r.ctr)}</td>
                    <td>${pct(r.cvr)}</td>
                    <td>${fmt(r.units)}</td>
                    <td>${fmt(r.revenue)}</td>
                    <td>${fmt2(r.roi)}</td>
                    <td>${suggestion}</td>
                </tr>
            `;
        });
    });

    /* =========================
       🎯 FINAL RENDER
    ========================= */

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
            <h3>Campaign × Placement Performance</h3>

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
                            <th>Suggestion</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cpRows || `<tr><td colspan="11">No data available</td></tr>`}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

/* ---------- HELPERS ---------- */

function fmt(n){ return Number(n||0).toLocaleString(); }
function fmt2(n){ return Number(n||0).toFixed(2); }
function pct(n){ return ((n||0)*100).toFixed(2)+"%"; }