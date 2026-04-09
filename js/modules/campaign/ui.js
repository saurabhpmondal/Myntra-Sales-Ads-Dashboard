export function renderCampaign(data){

    const container = document.getElementById("reportContainer");

    /* ---------------------------
       ✅ CAMPAIGN (UNCHANGED)
    --------------------------- */

    const campaignRows = Object.entries(data.campaign || data).map(([name,r]) => `
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
       🔥 AD GROUP (NOW FILTERED)
    --------------------------- */

    const raw = data.rows || []; // ✅ FIX

    const adMap = {};

    raw.forEach(r => {

        const name = r.adgroup_name || "NA";
        const id = r.adgroup_id || "";

        const key = `${name} (${id})`;

        if (!adMap[key]){
            adMap[key] = {
                impressions: 0,
                clicks: 0,
                spend: 0,
                units: 0,
                revenue: 0
            };
        }

        adMap[key].impressions += Number(r.impressions || 0);
        adMap[key].clicks += Number(r.clicks || 0);
        adMap[key].spend += Number(r.ad_spend || 0);
        adMap[key].units += Number(r.units_sold_total || 0);
        adMap[key].revenue += Number(r.total_revenue || 0);
    });

    Object.values(adMap).forEach(r => {
        r.ctr = r.impressions ? r.clicks / r.impressions : 0;
        r.roi = r.spend ? r.revenue / r.spend : 0;
    });

    const adRows = Object.entries(adMap).map(([name,r]) => `
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
       🎯 FINAL RENDER
    --------------------------- */

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
                    <tbody>${adRows}</tbody>
                </table>
            </div>
        </div>
    `;
}

/* ---------- HELPERS ---------- */

function fmt(n){ return Number(n||0).toLocaleString(); }
function fmt2(n){ return Number(n||0).toFixed(2); }
function pct(n){ return ((n||0)*100).toFixed(2)+"%"; }