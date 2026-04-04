import { applyGlobalFilters } from "../../core/filterEngine.js";
import { getData } from "../../core/dataRegistry.js";

export function buildDailyAdsData() {

    const ads = applyGlobalFilters(getData("CDR"));

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

        map[d].spend += r.ad_spend || 0;
        map[d].impressions += r.impressions || 0;
        map[d].clicks += r.clicks || 0;

        map[d].direct_units += r.direct_units_sold || 0;
        map[d].indirect_units += r.indirect_units_sold || 0;

        map[d].direct_rev += r.direct_revenue || 0;
        map[d].indirect_rev += r.indirect_revenue || 0;
    });

    // DERIVED METRICS
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