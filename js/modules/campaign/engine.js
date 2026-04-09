import { getData } from "../../core/dataRegistry.js";

export function buildCampaignData(){

    const raw = getData("CDR") || [];

    const state = window.APP_STATE || {};
    const from = state.from;
    const to = state.to;
    const brand = state.brand;

    const data = raw.filter(r => {

        const d = r.date;
        if (!d) return false;

        if (from && d < from) return false;
        if (to && d > to) return false;

        if (brand && r.brand && r.brand !== brand) return false;

        return true;
    });

    const map = {};

    data.forEach(r => {

        const key = r.campaign_name || "Unknown";

        if (!map[key]) {
            map[key] = {
                impressions: 0,
                clicks: 0,
                spend: 0,

                direct_units: 0,
                indirect_units: 0,

                direct_rev: 0,
                indirect_rev: 0
            };
        }

        map[key].impressions += Number(r.impressions || 0);
        map[key].clicks += Number(r.clicks || 0);
        map[key].spend += Number(r.ad_spend || 0);

        // 🔥 FIX: USE NORMALIZED FIELDS
        const totalUnits = Number(r.units_sold_total || 0);
        const totalRevenue = Number(r.total_revenue || 0);

        // 👉 distribute safely (keep structure intact)
        map[key].direct_units += totalUnits;
        map[key].indirect_units += 0;

        map[key].direct_rev += totalRevenue;
        map[key].indirect_rev += 0;
    });

    Object.values(map).forEach(r => {

        r.units = r.direct_units + r.indirect_units;
        r.revenue = r.direct_rev + r.indirect_rev;

        r.ctr = r.impressions ? r.clicks / r.impressions : 0;
        r.cvr = r.clicks ? r.units / r.clicks : 0;

        r.roi = r.spend ? r.revenue / r.spend : 0;
    });

    return map;
}