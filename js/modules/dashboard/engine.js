export function buildDashboard(data) {

    const state = window.APP_STATE || {};

    const sales = (data.SALES || []).filter(r => {

        // DATE BUILD (correct logic as you said)
        const d = formatDate(r);

        if (state.from && d < state.from) return false;
        if (state.to && d > state.to) return false;

        if (state.brand && r.brand !== state.brand) return false;

        return true;
    });

    const ads = data.CDR || [];

    let gmv = 0;
    let units = 0;

    const brandMap = {};
    const salesTrend = {};
    const adsTrend = {};

    // SALES
    sales.forEach(r => {

        const revenue = r.final_amount;
        const qty = r.qty;

        gmv += revenue;
        units += qty;

        const brand = r.brand || "UNKNOWN";

        if (!brandMap[brand]) {
            brandMap[brand] = { gmv: 0, units: 0, PPMP: 0, SJIT: 0, SOR: 0 };
        }

        brandMap[brand].gmv += revenue;
        brandMap[brand].units += qty;

        if (r.po_type === "PPMP") brandMap[brand].PPMP += revenue;
        else if (r.po_type === "SJIT") brandMap[brand].SJIT += revenue;
        else brandMap[brand].SOR += revenue;

        const key = formatDate(r);
        salesTrend[key] = (salesTrend[key] || 0) + revenue;
    });

    const asp = units ? gmv / units : 0;

    // ADS
    let spend = 0;
    let revenue = 0;
    let clicks = 0;
    let impressions = 0;

    ads.forEach(r => {
        spend += r.ad_spend;
        revenue += r.total_revenue;
        clicks += r.clicks;
        impressions += r.impressions;

        const d = r.date;
        adsTrend[d] = adsTrend[d] || { spend: 0, revenue: 0 };
        adsTrend[d].spend += r.ad_spend;
        adsTrend[d].revenue += r.total_revenue;
    });

    const ctr = impressions ? clicks / impressions : 0;
    const roi = spend ? revenue / spend : 0;

    return {
        kpi: { gmv, units, asp, spend, revenue, ctr, roi },
        charts: { sales: salesTrend, ads: adsTrend },
        brandMap
    };
}

/* ---------- DATE BUILDER ---------- */

function formatDate(r) {
    const day = String(r.date).padStart(2, "0");
    const month = convertMonth(r.month);
    return `${r.year}-${month}-${day}`;
}

function convertMonth(m) {
    const map = {
        JAN: "01", FEB: "02", MAR: "03", APR: "04",
        MAY: "05", JUN: "06", JUL: "07", AUG: "08",
        SEP: "09", OCT: "10", NOV: "11", DEC: "12"
    };
    return map[m] || "01";
}