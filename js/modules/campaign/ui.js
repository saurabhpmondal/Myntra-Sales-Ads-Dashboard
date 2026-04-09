import { getData } from "../../core/dataRegistry.js";

/* 🔥 THIS NAME MUST MATCH binder.js */
export function renderCampaign(){

    const container = document.getElementById("reportContainer");

    const data = getCampaignData();

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
                    <tbody>
                        ${campaignRows(data.campaign)}
                    </tbody>
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
                        ${adGroupRows(data.adgroup)}
                    </tbody>
                </table>
            </div>

        </div>
    `;
}

/* ---------- DATA ENGINE ---------- */

function getCampaignData(){

    const raw = getData("CDR") || [];

    let latest = { y:0, m:0 };

    raw.forEach(r=>{
        const d = (r.date || "").toString();
        if (d.length !== 8) return;

        const y = Number(d.slice(0,4));
        const m = Number(d.slice(4,6));

        if (y > latest.y || (y === latest.y && m > latest.m)){
            latest = { y, m };
        }
    });

    const filtered = raw.filter(r=>{
        const d = (r.date || "").toString();
        if (d.length !== 8) return false;

        const y = Number(d.slice(0,4));
        const m = Number(d.slice(4,6));

        return (y === latest.y && m === latest.m);
    });

    const campaign = {};
    const adgroup = {};

    filtered.forEach(r=>{

        const imp = Number(r.impressions) || 0;
        const clk = Number(r.clicks) || 0;
        const spend = Number(r.ad_spend) || 0;
        const revenue = Number(r.total_revenue) || 0;
        const units = Number(r.units_sold_total) || 0;

        /* CAMPAIGN */

        const cKey = r.campaign_name || "UNKNOWN";

        if (!campaign[cKey]){
            campaign[cKey] = init();
        }

        add(campaign[cKey], imp, clk, spend, revenue, units);

        /* AD GROUP */

        const aKey = `${r.adgroup_name || "NA"} (${r.adgroup_id || ""})`;

        if (!adgroup[aKey]){
            adgroup[aKey] = init();
        }

        add(adgroup[aKey], imp, clk, spend, revenue, units);
    });

    return {
        campaign: finalize(campaign),
        adgroup: finalize(adgroup)
    };
}

/* ---------- HELPERS ---------- */

function init(){
    return {
        impressions:0,
        clicks:0,
        spend:0,
        revenue:0,
        units:0
    };
}

function add(obj, imp, clk, spend, revenue, units){
    obj.impressions += imp;
    obj.clicks += clk;
    obj.spend += spend;
    obj.revenue += revenue;
    obj.units += units;
}

function finalize(map){
    return Object.entries(map)
        .map(([k,v])=>{
            const ctr = v.impressions ? v.clicks / v.impressions : 0;
            const roi = v.spend ? v.revenue / v.spend : 0;

            return {
                name: k,
                ...v,
                ctr,
                roi
            };
        })
        .sort((a,b)=> b.revenue - a.revenue);
}

/* ---------- UI ---------- */

function campaignRows(data){
    return data.map(r=>`
        <tr>
            <td>${r.name}</td>
            <td>${fmt(r.impressions)}</td>
            <td>${fmt(r.clicks)}</td>
            <td>${pct(r.ctr)}</td>
            <td>${fmt(r.units)}</td>
            <td>${fmt(r.revenue)}</td>
            <td>${fmt(r.spend)}</td>
            <td>${fmt2(r.roi)}</td>
        </tr>
    `).join("");
}

function adGroupRows(data){
    return data.map(r=>`
        <tr>
            <td>${r.name}</td>
            <td>${fmt(r.impressions)}</td>
            <td>${fmt(r.clicks)}</td>
            <td>${pct(r.ctr)}</td>
            <td>${fmt(r.units)}</td>
            <td>${fmt(r.revenue)}</td>
            <td>${fmt(r.spend)}</td>
            <td>${fmt2(r.roi)}</td>
        </tr>
    `).join("");
}

function fmt(n){ return Number(n||0).toLocaleString(); }
function fmt2(n){ return Number(n||0).toFixed(2); }
function pct(n){ return ((n||0)*100).toFixed(1)+"%"; }