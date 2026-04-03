import { getData } from "../../core/stateManager.js";

export function buildPlacementReport() {

    const data = getData("PPR");

    const map = {};

    data.forEach(r => {

        const key = r.placement || "UNKNOWN";

        if (!map[key]) {
            map[key] = {
                impressions: 0,
                clicks: 0,
                spend: 0,
                revenue: 0
            };
        }

        map[key].impressions += r.impressions;
        map[key].clicks += r.clicks;
        map[key].spend += r.spend;
        map[key].revenue += r.revenue;
    });

    return map;
}