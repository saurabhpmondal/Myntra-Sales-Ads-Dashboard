import { getData } from "../../core/stateManager.js";

export function buildDashboard() {

    const sales = getData("SALES");
    const ads = getData("CDR");

    let gmv = 0, units = 0;
    const dailySales = {};

    sales.forEach(r => {
        gmv += r.revenue;
        units += r.units;

        if (!dailySales[r.date]) dailySales[r.date] = 0;
        dailySales[r.date] += r.revenue;
    });

    let spend = 0, revenue = 0;
    const dailyAds = {};

    ads.forEach(r => {
        spend += r.spend;
        revenue += r.revenue;

        if (!dailyAds[r.date]) dailyAds[r.date] = { spend: 0, revenue: 0 };

        dailyAds[r.date].spend += r.spend;
        dailyAds[r.date].revenue += r.revenue;
    });

    return {
        kpi: {
            gmv,
            units,
            asp: units ? gmv / units : 0,
            spend,
            revenue
        },
        charts: {
            sales: dailySales,
            ads: dailyAds
        }
    };
}