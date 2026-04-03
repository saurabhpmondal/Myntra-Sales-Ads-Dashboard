import { getData, getFilter } from "../../core/stateManager.js";
import { applyDateFilter } from "../../filters/engine.js";

export function buildCampaignReport() {

    let data = getData("CDR");
    const filter = getFilter();

    data = applyDateFilter(data, filter);

    const map = {};

    data.forEach(r => {

        const key = r.campaign_name;

        if (!map[key]) {
            map[key] = {
                impressions: 0,
                clicks: 0,
                spend: 0,
                revenue: 0,
                units: 0
            };
        }

        map[key].impressions += r.impressions;
        map[key].clicks += r.clicks;
        map[key].spend += r.spend;
        map[key].revenue += r.revenue;
        map[key].units += r.units;
    });

    return map;
}