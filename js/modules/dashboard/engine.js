export function buildDashboard(data) {

    const state = window.APP_STATE || {};

    const monthMapNum = {
        JAN:1,FEB:2,MAR:3,APR:4,MAY:5,JUN:6,
        JUL:7,AUG:8,SEP:9,OCT:10,NOV:11,DEC:12
    };

    function normMonth(m){
        return (m || "").toString().trim().toUpperCase();
    }

    /* =========================
       LATEST MONTH DETECTION
    ========================= */

    let latest = { y:0, m:0 };

    (data.SALES || []).forEach(r => {

        const m = monthMapNum[normMonth(r.month)];
        const y = Number(r.year);

        if (!m || !y) return;

        if (y > latest.y || (y === latest.y && m > latest.m)){
            latest = { y, m };
        }
    });

    const latestMonthStart =
        `${latest.y}-${String(latest.m).padStart(2,"0")}-01`;

    /* =========================
       DEFAULT END DATE = YESTERDAY
    ========================= */

    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - 1);

    const latestMonthEnd =
        `${baseDate.getFullYear()}-${String(baseDate.getMonth()+1).padStart(2,"0")}-${String(baseDate.getDate()).padStart(2,"0")}`;

    /* =========================
       SALES FILTER
    ========================= */

    const sales = (data.SALES || []).filter(r => {

        const d = buildDate(r);

        if (!d) return false;

        if (state.from || state.to){

            if (state.from && d < state.from) return false;
            if (state.to && d > state.to) return false;

        } else {

            const m = monthMapNum[normMonth(r.month)];
            const y = Number(r.year);

            if (m !== latest.m || y !== latest.y) return false;

            if (d < latestMonthStart) return false;
            if (d > latestMonthEnd) return false;
        }

        if (state.brand && r.brand !== state.brand) return false;

        return true;
    });

    /* =========================
       ADS FILTER
    ========================= */

    const ads = (data.CDR || []).filter(r => {

        const raw = (r.date || "").toString();

        const d =
            raw.length === 8
            ? `${raw.slice(0,4)}-${raw.slice(4,6)}-${raw.slice(6,8)}`
            : raw;

        if (!d) return false;

        if (state.from || state.to){

            if (state.from && d < state.from) return false;
            if (state.to && d > state.to) return false;

            return true;
        }

        if (d < latestMonthStart) return false;
        if (d > latestMonthEnd) return false;

        return true;
    });

    /* =========================
       KPI + MAPS
    ========================= */

    let gmv = 0;
    let units = 0;

    const brandMap = {};
    const salesTrend = {};
    const unitsTrend = {};
    const adsTrend = {};

    sales.forEach(r => {

        const rev = Number(r.final_amount) || 0;
        const qty = Number(r.qty) || 0;

        gmv += rev;
        units += qty;

        const brand = r.brand || "UNKNOWN";

        if (!brandMap[brand]) {
            brandMap[brand] = {
                gmv:0,
                units:0,
                PPMP:0,
                SJIT:0,
                SOR:0
            };
        }

        brandMap[brand].gmv += rev;
        brandMap[brand].units += qty;

        if (r.po_type === "PPMP") brandMap[brand].PPMP += rev;
        else if (r.po_type === "SJIT") brandMap[brand].SJIT += rev;
        else brandMap[brand].SOR += rev;

        const key = buildDate(r);

        salesTrend[key] = (salesTrend[key] || 0) + rev;
        unitsTrend[key] = (unitsTrend[key] || 0) + qty;
    });

    ads.forEach(r => {

        const raw = (r.date || "").toString();

        const d =
            raw.length === 8
            ? `${raw.slice(0,4)}-${raw.slice(4,6)}-${raw.slice(6,8)}`
            : raw;

        if (!adsTrend[d]){
            adsTrend[d] = {
                spend:0,
                revenue:0
            };
        }

        adsTrend[d].spend += Number(r.ad_spend) || 0;
        adsTrend[d].revenue += Number(r.total_revenue) || 0;
    });

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

    const asp = units ? gmv / units : 0;
    const ctr = impressions ? clicks / impressions : 0;
    const roi = spend ? revenue / spend : 0;

    return {
        kpi:{
            gmv,
            units,
            asp,
            spend,
            revenue,
            ctr,
            roi
        },
        charts:{
            sales: cleanTrend(salesTrend),
            units: cleanTrend(unitsTrend),
            ads: adsTrend
        },
        brandMap
    };
}

/* ========================= */

function cleanTrend(obj){

    const out = {};

    Object.keys(obj)
        .sort()
        .forEach(k => {
            if (obj[k] > 0) out[k] = obj[k];
        });

    return out;
}

/* ========================= */

function buildDate(r){

    const monthMap = {
        JAN:"01",FEB:"02",MAR:"03",APR:"04",
        MAY:"05",JUN:"06",JUL:"07",AUG:"08",
        SEP:"09",OCT:"10",NOV:"11",DEC:"12"
    };

    const dd = String(r.date || "").padStart(2,"0");
    const mm = monthMap[(r.month || "").toUpperCase().trim()] || "01";
    const yy = String(r.year || "");

    if (!yy || !dd) return "";

    return `${yy}-${mm}-${dd}`;
}