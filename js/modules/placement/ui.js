import { getData } from "../../core/dataRegistry.js";

export function renderPlacement(data){

    const container = document.getElementById("reportContainer");

    /* ---------------------------
       ✅ EXISTING TABLE (UNCHANGED)
    --------------------------- */

    const rows = Object.entries(data).map(([name,r]) => `
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

    /* ---------------------------
       🔥 CAMPAIGN × PLACEMENT (FIXED GROUPING)
    --------------------------- */

    const raw = getData("PPR") || [];

    const VALID = [
        "top of search",
        "rest of search",
        "top of pdp",
        "rest of pdp",
        "top of home",
        "rest of home"
    ];

    const map = {};

    raw.forEach(r => {

        // ✅ STRICT VALIDATION (NO UNKNOWN ALLOWED)
        if (!r.campaign_name || !r.placement) return;

        const campaign = r.campaign_name.trim();

        const pRaw = r.placement.toString().trim().toLowerCase();
        if (!VALID.includes(pRaw)) return;

        const placement = pRaw.replace(/\b\w/g, c => c.toUpperCase());

        const key = `${campaign}||${placement}`;

        if (!map[key]){
            map[key] = {
                campaign,
                placement,
                impressions: 0,
                clicks: 0,
                spend: 0,
                revenue: 0,
                units: 0
            };
        }

        map[key].impressions += Number(r.impressions || 0);
        map[key].clicks += Number(r.clicks || 0);
        map[key].spend += Number(r.spend || 0);
        map[key].revenue += Number(r.revenue || 0);
        map[key].units += Number(r.units_sold_total || 0);
    });

    const grouped = {};

    Object.values(map).forEach(r => {

        r.ctr = r.impressions ? r.clicks / r.impressions : 0;
        r.cvr = r.clicks ? r.units / r.clicks : 0;
        r.roi = r.spend ? r.revenue / r.spend : 0;

        // suggestions (unchanged logic)
        if (r.roi >= 3 && r.cvr >= 0.03){
            r.suggestion = "🚀 Scale";
        } else if (r.roi < 1 && r.spend > 1000){
            r.suggestion = "❌ Cut";
        } else if (r.impressions > 5000 && r.ctr < 0.005){
            r.suggestion = "⚠️ Fix CTR";
        } else if (r.clicks > 200 && r.cvr < 0.01){
            r.suggestion = "⚠️ Fix CVR";
        } else if (r.spend < 500){
            r.suggestion = "🧪 Test";
        } else {
            r.suggestion = "⚖️ Stable";
        }

        if (!grouped[r.campaign]) grouped[r.campaign] = [];
        grouped[r.campaign].push(r);
    });

    const sortedCampaigns = Object.entries(grouped)
        .map(([c, arr]) => {
            const totalSpend = arr.reduce((s,x)=>s + x.spend, 0);
            return [c, arr, totalSpend];
        })
        .sort((a,b)=> b[2] - a[2]);

    let cpRows = "";

    sortedCampaigns.forEach(([campaign, placements]) => {

        placements.sort((a,b)=> b.spend - a.spend);

        let bestROI = Math.max(...placements.map(p => p.roi));

        placements.forEach((r, idx) => {

            const isBest = r.roi === bestROI;

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
                    <td>${r.suggestion}</td>
                </tr>
            `;
        });
    });

    /* ---------------------------
       🎯 FINAL RENDER
    --------------------------- */

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
                    <tbody>${cpRows}</tbody>
                </table>
            </div>
        </div>
    `;
}

/* ---------- HELPERS ---------- */

function fmt(n){ return Number(n||0).toLocaleString(); }
function fmt2(n){ return Number(n||0).toFixed(2); }
function pct(n){ return ((n||0)*100).toFixed(2)+"%"; }