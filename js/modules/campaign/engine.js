import { getData } from "../../core/dataRegistry.js";

export function buildCampaignData(){

    const raw = getData("CDR") || [];

    if (!raw.length) return { campaign:{}, adgroup:{} };

    /* ---------------------------
       🔥 FIND LATEST MONTH
    --------------------------- */

    let latest = { y:0, m:0 };

    raw.forEach(r=>{
        const d = String(r.date || "");

        if (d.length >= 6){
            const y = Number(d.slice(0,4));
            const m = Number(d.slice(4,6));

            if (y && m){
                if (y > latest.y || (y === latest.y && m > latest.m)){
                    latest = { y, m };
                }
            }
        }
    });

    /* ---------------------------
       🔥 FILTER CURRENT MONTH
    --------------------------- */

    const filtered = raw.filter(r=>{
        const d = String(r.date || "");

        if (d.length >= 6){
            const y = Number(d.slice(0,4));
            const m = Number(d.slice(4,6));
            return (y === latest.y && m === latest.m);
        }

        return false;
    });

    /* ---------------------------
       🔥 GROUPING
    --------------------------- */

    const campaign = {};
    const adgroup = {};

    filtered.forEach(r=>{

        const imp = Number(r.impressions) || 0;
        const clk = Number(r.clicks) || 0;
        const spend = Number(r.ad_spend) || 0;
        const revenue = Number(r.total_revenue) || 0;
        const units = Number(r.units_sold_total) || 0;

        /* ---------- CAMPAIGN ---------- */

        const cKey = r.campaign_name || "UNKNOWN";

        if (!campaign[cKey]){
            campaign[cKey] = init();
        }

        add(campaign[cKey], imp, clk, spend, revenue, units);

        /* ---------- AD GROUP ---------- */

        const aKey = `${r.adgroup_name || "NA"} (${r.adgroup_id || ""})`;

        if (!adgroup[aKey]){
            adgroup[aKey] = init();
        }

        add(adgroup[aKey], imp, clk, spend, revenue, units);
    });

    /* ---------------------------
       🔥 FINAL METRICS
    --------------------------- */

    applyMetrics(campaign);
    applyMetrics(adgroup);

    return { campaign, adgroup };
}

/* ---------- HELPERS ---------- */

function init(){
    return {
        impressions:0,
        clicks:0,
        spend:0,
        revenue:0,
        units:0,
        ctr:0,
        roi:0
    };
}

function add(obj, imp, clk, spend, revenue, units){
    obj.impressions += imp;
    obj.clicks += clk;
    obj.spend += spend;
    obj.revenue += revenue;
    obj.units += units;
}

function applyMetrics(map){
    Object.values(map).forEach(r=>{
        r.ctr = r.impressions ? r.clicks / r.impressions : 0;
        r.roi = r.spend ? r.revenue / r.spend : 0;
    });
}