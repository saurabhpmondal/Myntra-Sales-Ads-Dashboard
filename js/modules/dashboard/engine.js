export function buildDashboard(data) {

    const sales = data.SALES || [];
    const ads = data.CDR || [];

    let gmv = 0;
    let units = 0;

    const brandMap = {};
    const salesTrend = {};
    const adsTrend = {};

    // -------- SALES --------
    sales.forEach(r => {

        const revenue = Number(r.final_amount) || 0;
        const qty = Number(r.qty) || 0;

        gmv += revenue;
        units += qty;

        const brand = r.brand || "UNKNOWN";

        if (!brandMap[brand]) {
            brandMap[brand] = {
                gmv: 0,
                units: 0,
                PPMP: 0,
                SJIT: 0,
                SOR: 0
            };
        }

        brandMap[brand].gmv += revenue;
        brandMap[brand].units += qty;

        // PO TYPE SPLIT
        const po = r.po_type;
        if (po === "PPMP") brandMap[brand].PPMP += revenue;
        else if (po === "SJIT") brandMap[brand].SJIT += revenue;
        else brandMap[brand].SOR += revenue;

        // SALES TREND
        const key = `${r.year}-${r.month}-${r.date}`;
        salesTrend[key] = (salesTrend[key] || 0) + revenue;
    });

    const asp = units ? gmv / units : 0;

    // -------- ADS --------
    let spend = 0;
    let revenue = 0;
    let clicks = 0;
    let impressions = 0;

    ads.forEach(r => {

        const s = Number(r.ad_spend) || 0;
        const rev = Number(r.total_revenue) || 0;

        spend += s;
        revenue += rev;
        clicks += Number(r.clicks) || 0;
        impressions += Number(r.impressions) || 0;

        const date = r.date;
        adsTrend[date] = adsTrend[date] || { spend: 0, revenue: 0 };

        adsTrend[date].spend += s;
        adsTrend[date].revenue += rev;
    });

    const ctr = impressions ? clicks / impressions : 0;
    const roi = spend ? revenue / spend : 0;

    return {
        kpi: { gmv, units, asp, spend, revenue, ctr, roi },
        charts: {
            sales: salesTrend,
            ads: adsTrend
        },
        brandMap
    };
}