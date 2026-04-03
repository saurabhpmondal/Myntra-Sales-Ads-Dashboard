import { getData } from "../../core/stateManager.js";

export function buildDashboard() {

    const sales = getData("SALES");
    const ads = getData("CDR");

    let gmv = 0, units = 0;

    sales.forEach(r => {
        gmv += r.revenue || 0;
        units += r.units || 0;
    });

    let spend = 0, revenue = 0, clicks = 0, impressions = 0;

    ads.forEach(r => {
        spend += r.spend || 0;
        revenue += r.revenue || 0;
        clicks += r.clicks || 0;
        impressions += r.impressions || 0;
    });

    return {
        sales: {
            gmv,
            units,
            asp: units ? gmv / units : 0
        },
        ads: {
            spend,
            revenue,
            ctr: impressions ? clicks / impressions : 0,
            roi: spend ? revenue / spend : 0
        }
    };
}