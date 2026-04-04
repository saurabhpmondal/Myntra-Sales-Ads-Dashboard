export function buildDashboard(data) {

    const sales = data.SALES || [];
    const ads = data.CDR || [];

    let gmv = 0;
    let units = 0;

    // SALES
    sales.forEach(r => {
        gmv += Number(r.final_amount) || 0;
        units += Number(r.qty) || 0;
    });

    const asp = units ? gmv / units : 0;

    // ADS
    let spend = 0;
    let revenue = 0;
    let clicks = 0;
    let impressions = 0;

    ads.forEach(r => {
        spend += Number(r.ad_spend) || 0;
        revenue += Number(r.total_revenue) || 0;
        clicks += Number(r.clicks) || 0;
        impressions += Number(r.impressions) || 0;
    });

    const ctr = impressions ? clicks / impressions : 0;
    const roi = spend ? revenue / spend : 0;

    return {
        kpi: {
            gmv,
            units,
            asp,
            spend,
            revenue,
            ctr,
            roi
        },
        charts: {
            sales: {},
            ads: {}
        },
        brandMap: {}
    };
}