import { getData } from "../../core/dataRegistry.js";

export function buildDailyAdsData() {

    const raw = getData("CDR") || [];

    const state = window.APP_STATE || {};
    const from = state.from;
    const to = state.to;
    const brand = state.brand;

    const ads = raw.filter(r => {

        const d = r.date;
        if (!d) return false;

        if (from && d < from) return false;
        if (to && d > to) return false;

        if (brand && r.brand && r.brand !== brand) return false;

        return true;
    });

    const map = {};

    ads.forEach(r => {

        const d = r.date;
        if (!d) return;

        if (!map[d]) {
            map[d] = {
                spend: 0,
                impressions: 0,
                clicks: 0,

                direct_units: 0,
                indirect_units: 0,

                direct_rev: 0,
                indirect_rev: 0
            };
        }

        const spend = Number(r.ad_spend || 0);
        const impressions = Number(r.impressions || 0);
        const clicks = Number(r.clicks || 0);

        // 🔥 FIX → FALLBACK LOGIC
        const dUnits = Number(r.direct_units_sold || r.total_converted_units || 0);
        const iUnits = Number(r.indirect_units_sold || 0);

        const dRev = Number(r.direct_revenue || r.total_revenue || 0);
        const iRev = Number(r.indirect_revenue || 0);

        map[d].spend += spend;
        map[d].impressions += impressions;
        map[d].clicks += clicks;

        map[d].direct_units += dUnits;
        map[d].indirect_units += iUnits;

        map[d].direct_rev += dRev;
        map[d].indirect_rev += iRev;
    });

    Object.values(map).forEach(r => {

        r.total_units = r.direct_units + r.indirect_units;
        r.total_rev = r.direct_rev + r.indirect_rev;

        r.ctr = r.impressions ? r.clicks / r.impressions : 0;
        r.cvr = r.clicks ? r.total_units / r.clicks : 0;
        r.cpc = r.clicks ? r.spend / r.clicks : 0;

        r.roi_direct = r.spend ? r.direct_rev / r.spend : 0;
        r.roi_indirect = r.spend ? r.indirect_rev / r.spend : 0;
        r.roi_total = r.spend ? r.total_rev / r.spend : 0;
    });

    return map;
}