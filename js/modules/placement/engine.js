import { getData } from "../../core/dataRegistry.js";

export function buildPlacementData() {

    const raw = getData("PPR") || [];

    const state = window.APP_STATE || {};
    const from = state.from;
    const to = state.to;

    const map = {};

    raw.forEach(r => {

        // 🔥 FIX → PPR may not have date → skip date filtering safely
        const d = r.date;

        if (d && from && d < from) return;
        if (d && to && d > to) return;

        const p = r.placement_type || "UNKNOWN";

        if (!map[p]) {
            map[p] = {
                impressions: 0,
                clicks: 0,
                spend: 0,
                direct_units: 0,
                indirect_units: 0,
                direct_rev: 0,
                indirect_rev: 0
            };
        }

        map[p].impressions += Number(r.views || 0);
        map[p].clicks += Number(r.clicks || 0);
        map[p].spend += Number(r.ad_spend || 0);

        // 🔥 SAFE FALLBACK
        const dUnits = Number(r.direct_units_sold || r.direct_units || 0);
        const iUnits = Number(r.indirect_units_sold || 0);

        const dRev = Number(r.direct_revenue || 0);
        const iRev = Number(r.indirect_revenue || 0);

        map[p].direct_units += dUnits;
        map[p].indirect_units += iUnits;

        map[p].direct_rev += dRev;
        map[p].indirect_rev += iRev;
    });

    Object.values(map).forEach(r => {

        r.total_units = r.direct_units + r.indirect_units;
        r.total_rev = r.direct_rev + r.indirect_rev;

        r.ctr = r.impressions ? r.clicks / r.impressions : 0;
        r.cvr = r.clicks ? r.total_units / r.clicks : 0;
        r.cpc = r.clicks ? r.spend / r.clicks : 0;
        r.roi = r.spend ? r.total_rev / r.spend : 0;
    });

    return map;
}