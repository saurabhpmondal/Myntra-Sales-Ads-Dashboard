export function buildDashboard(data) {

    const state = window.APP_STATE || {};

    const sales = (data.SALES || []).filter(r => {

        const d = buildDate(r);

        if (state.from && d < state.from) return false;
        if (state.to && d > state.to) return false;
        if (state.brand && r.brand !== state.brand) return false;

        return true;
    });

    const ads = (data.CDR || []).filter(r => {

        const d = r.date;

        if (state.from && d < state.from) return false;
        if (state.to && d > state.to) return false;

        return true;
    });

    let gmv = 0;
    let units = 0;

    const brandMap = {};
    const salesTrend = {};
    const unitsTrend = {};
    const adsTrend = {};

    // -------- SALES --------
    sales.forEach(r => {

        const revenue = Number(r.final_amount) || 0;
        const qty = Number(r.qty) || 0;

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

        const key = buildDate(r);

        if (!key || revenue <= 0) return;

        salesTrend[key] = (salesTrend[key] || 0) + revenue;
        unitsTrend[key] = (unitsTrend[key] || 0) + qty;
    });

    const cleanedSalesTrend = cleanTrend(salesTrend);
    const cleanedUnitsTrend = cleanTrend(unitsTrend);

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

        const d = r.date;

        if (!d || s <= 0) return;

        if (!adsTrend[d]) {
            adsTrend[d] = { spend: 0, revenue: 0 };
        }

        adsTrend[d].spend += s;
        adsTrend[d].revenue += rev;
    });

    const ctr = impressions ? clicks / impressions : 0;
    const roi = spend ? revenue / spend : 0;

    return {
        kpi: { gmv, units, asp, spend, revenue, ctr, roi },
        charts: {
            sales: cleanedSalesTrend,
            units: cleanedUnitsTrend,
            ads: adsTrend
        },
        brandMap
    };
}

/* ---------- CLEAN TREND ---------- */

function cleanTrend(trend){

    const sortedKeys = Object.keys(trend).sort();
    const cleaned = {};

    sortedKeys.forEach(k => {
        const v = trend[k];
        if (v > 0) cleaned[k] = v;
    });

    return cleaned;
}

/* ---------- DATE BUILDER ---------- */

function buildDate(r) {

    const monthMap = {
        JAN: "01", FEB: "02", MAR: "03", APR: "04",
        MAY: "05", JUN: "06", JUNE: "06",
        JUL: "07", AUG: "08", SEP: "09",
        OCT: "10", NOV: "11", DEC: "12"
    };

    const day = String(r.date).padStart(2, "0");
    const month = monthMap[(r.month || "").toUpperCase()] || "01";

    return `${r.year}-${month}-${day}`;
}