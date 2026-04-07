import { getData } from "../../core/dataRegistry.js";

export function buildPlacementData() {

    const raw = getData("PPR") || [];

    const map = {};

    raw.forEach(r => {

        const p = (r.placement || "UNKNOWN").toString().trim();

        if (!p) return;

        if (!map[p]) {
            map[p] = {
                impressions: 0,
                clicks: 0,
                spend: 0,
                revenue: 0
            };
        }

        map[p].impressions += Number(r.impressions || 0);
        map[p].clicks += Number(r.clicks || 0);
        map[p].spend += Number(r.spend || 0);
        map[p].revenue += Number(r.revenue || 0);
    });

    // 🔥 DERIVED METRICS (ONLY WHAT DATA SUPPORTS)
    Object.values(map).forEach(r => {

        r.ctr = r.impressions ? r.clicks / r.impressions : 0;
        r.cpc = r.clicks ? r.spend / r.clicks : 0;
        r.roi = r.spend ? r.revenue / r.spend : 0;
    });

    return map;
}