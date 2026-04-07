import { getData } from "../../core/dataRegistry.js";

export function buildPlacementData() {

    const raw = getData("PPR") || [];

    const state = window.APP_STATE || {};

    // 🔥 SAFE MONTH EXTRACTOR
    function getMonthKey(dateStr){
        if (!dateStr) return null;
        return new Date(dateStr)
            .toLocaleString("en-US", { month: "short" })
            .toLowerCase();
    }

    const selectedMonth = getMonthKey(state.from) 
        || new Date().toLocaleString("en-US", { month: "short" }).toLowerCase();

    const map = {};

    raw.forEach(r => {

        // 🔥 NORMALIZE ROW MONTH
        const rowMonth = (r.month || "")
            .toLowerCase()
            .slice(0,3);   // jan, feb, mar...

        // 🔥 FILTER
        if (selectedMonth && rowMonth !== selectedMonth) return;

        const p = r.placement || "UNKNOWN";

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

        map[p].impressions += Number(r.impressions || 0);
        map[p].clicks += Number(r.clicks || 0);
        map[p].spend += Number(r.budget_spend || 0);

        map[p].direct_units += Number(r.units_sold_direct || 0);
        map[p].indirect_units += Number(r.units_sold_indirect || 0);

        map[p].direct_rev += Number(r.direct_revenue || 0);
        map[p].indirect_rev += Number(r.indirect_revenue || 0);
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