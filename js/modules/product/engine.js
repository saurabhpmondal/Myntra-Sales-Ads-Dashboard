import { getData } from "../../core/stateManager.js";
import { getFilter } from "../../core/stateManager.js";
import { applyDateFilter } from "../../filters/engine.js";

export function buildDailyAds() {

    let data = getData("CDR");
    const filter = getFilter();

    data = applyDateFilter(data, filter);

    const map = {};

    data.forEach(r => {

        if (!map[r.date]) {
            map[r.date] = {
                spend: 0,
                revenue: 0,
                clicks: 0,
                impressions: 0
            };
        }

        map[r.date].spend += r.spend;
        map[r.date].revenue += r.revenue;
        map[r.date].clicks += r.clicks;
        map[r.date].impressions += r.impressions;
    });

    return map;
}