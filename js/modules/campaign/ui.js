export function renderCampaign(data){

    const container = document.getElementById("reportContainer");

    /* ---------------------------
       ✅ EXISTING CAMPAIGN (UNCHANGED)
    --------------------------- */

    const campaignRows = Object.entries(data.campaign || {}).map(([name,r]) => `
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

    /* ---------------------------
       ✅ NEW AD GROUP (SAFE ADD)
    --------------------------- */

    const adGroupRows = Object.entries(data.adgroup || {}).map(([name,r]) => `
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

    container.innerHTML = `
        <div class="card table-card">
            <h3>Campaign Performance</h3>

            <div class="table-wrapper">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Campaign</th>
                            <th>Impressions</th>
                            <th>Clicks</th>
                            <th>CTR</th>
                            <th>Units</th>
                            <th>Revenue</th>
                            <th>Spend</th>
                            <th>ROI</th>
                        </tr>
                    </thead>
                    <tbody>${campaignRows}</tbody>
                </table>
            </div>
        </div>

        <div class="card table-card">
            <h3>Ad Group Performance</h3>

            <div class="table-wrapper">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Ad Group</th>
                            <th>Impressions</th>
                            <th>Clicks</th>
                            <th>CTR</th>
                            <th>Units</th>
                            <th>Revenue</th>
                            <th>Spend</th>
                            <th>ROI</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${adGroupRows || `<tr><td colspan="8">No data</td></tr>`}
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