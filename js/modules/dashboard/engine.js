export function buildDashboard(data) {

    const state = window.APP_STATE || {};

    /* ---------------------------
       🔥 SAFE MONTH DETECTION
    --------------------------- */

    const monthMapNum = {
        JAN:1,FEB:2,MAR:3,APR:4,MAY:5,JUN:6,
        JUL:7,AUG:8,SEP:9,OCT:10,NOV:11,DEC:12
    };

    function normMonth(m){
        return (m || "").toString().trim().toUpperCase();
    }

    let latest = { y: 0, m: 0 };

    (data.SALES || []).forEach(r=>{
        const m = monthMapNum[normMonth(r.month)];
        const y = Number(r.year);

        if (!m || !y) return;

        if (y > latest.y || (y === latest.y && m > latest.m)){
            latest = { y, m };
        }
    });

    /* ---------------------------
       🔥 SALES FILTER (FIXED)
    --------------------------- */

    const sales = (data.SALES || []).filter(r => {

        const d = buildDate(r);

        if (state.from || state.to){
            if (state.from && d < state.from) return false;
            if (state.to && d > state.to) return false;
        } 
        else {
            const m = monthMapNum[normMonth(r.month)];
            const y = Number(r.year);

            if (m !== latest.m || y !== latest.y) return false;
        }

        if (state.brand && r.brand !== state.brand) return false;

        return true;
    });

    /* ---------------------------
       🔥 ADS FILTER (RESTORED + SAFE)
    --------------------------- */

    const ads = (data.CDR || []).filter(r => {

        const raw = (r.date || "").toString();

        // restore working behavior first
        if (state.from || state.to){
            const d = raw;
            if (state.from && d < state.from) return false;
            if (state.to && d > state.to) return false;
            return true;
        }

        // apply month logic safely
        if (raw.length !== 8) return true; // don't break data

        const y = Number(raw.slice(0,4));
        const m = Number(raw.slice(4,6));

        if (!y || !m) return true;

        return (m === latest.m && y === latest.y);
    });

    let gmv = 0;
    let units = 0;

    const brandMap = {};
    const salesTrend = {};
    const unitsTrend = {};
    const adsTrend = {};

    /* -------- SALES -------- */
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

    /* -------- ADS -------- */
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

        const raw = (r.date || "").toString();

        if (!raw || s <= 0) return;

        const d = raw.length === 8
            ? `${raw.slice(0,4)}-${raw.slice(4,6)}-${raw.slice(6,8)}`
            : raw;

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
    const month = monthMap[(r.month || "").toUpperCase().trim()] || "01";

    return `${r.year}-${month}-${day}`;
}