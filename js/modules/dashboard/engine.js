import { getData, getFilter } from "../../core/stateManager.js";
import { applyDateFilter } from "../../filters/engine.js";

export function buildDashboard() {

    const filter = getFilter();

    let sales = getData("SALES");
    let ads = getData("CDR");

    sales = applyDateFilter(sales, filter);
    ads = applyDateFilter(ads, filter);

    let gmv = 0, units = 0;

    const brandMap = {};
    const dailySales = {};

    sales.forEach(r => {

        gmv += r.revenue;
        units += r.units;

        // brand aggregation
        if (!brandMap[r.brand]) {
            brandMap[r.brand] = {
                gmv: 0,
                units: 0,
                PPMP: 0,
                SJIT: 0,
                SOR: 0
            };
        }

        brandMap[r.brand].gmv += r.revenue;
        brandMap[r.brand].units += r.units;

        if (r.po_type) {
            brandMap[r.brand][r.po_type] += r.revenue;
        }

        // daily
        if (!dailySales[r.date]) dailySales[r.date] = 0;
        dailySales[r.date] += r.revenue;
    });

    let spend = 0, revenue = 0, clicks = 0, impressions = 0;

    const dailyAds = {};

    ads.forEach(r => {

        spend += r.spend;
        revenue += r.revenue;
        clicks += r.clicks;
        impressions += r.impressions;

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
            revenue,
            ctr: impressions ? clicks / impressions : 0,
            roi: spend ? revenue / spend : 0
        },
        brandMap,
        charts: {
            sales: dailySales,
            ads: dailyAds
        }
    };
}