import { getData } from "../../core/dataRegistry.js";

export function buildStyleIntelligence(styleId){

    const sales = getData("SALES") || [];
    const ads = getData("CDR") || [];
    const traffic = getData("TRAFFIC") || [];

    const sjitRaw = getData("sjit_stock") || [];
    const sorRaw = getData("sor_stock") || [];
    const sellerRaw = getData("seller_stock") || [];
    const productRaw = getData("product_master") || [];

    const s = sales.filter(r => r.style_id == styleId);
    if (!s.length) return null;

    const a = ads.filter(r => r.style_id == styleId);
    const t = traffic.filter(r => r.style_id == styleId);

    /* =========================
       SALES + TREND
    ========================= */

    let units = 0;
    let revenue = 0;
    const trend = {};

    s.forEach(r => {
        const qty = Number(r.qty || 0);
        const rev = Number(r.final_amount || 0);

        units += qty;
        revenue += rev;

        const d = buildDate(r);
        if (d){
            if (!trend[d]) trend[d] = { revenue: 0 };
            trend[d].revenue += rev;
        }
    });

    const asp = units ? revenue / units : 0;

    /* =========================
       ADS
    ========================= */

    let ad_spend = 0;
    let ad_revenue = 0;

    a.forEach(r => {
        ad_spend += Number(r.ad_spend || 0);
        ad_revenue += Number(r.total_revenue || 0);
    });

    const roi = ad_spend ? ad_revenue / ad_spend : 0;

    /* =========================
       TRAFFIC
    ========================= */

    let impressions = 0;
    let clicks = 0;
    let atc = 0;

    t.forEach(r => {
        impressions += Number(r.impressions || 0);
        clicks += Number(r.clicks || 0);
        atc += Number(r.add_to_cart || 0);
    });

    const cvr = clicks ? units / clicks : 0;
    const ctr = impressions ? clicks / impressions : 0;

    /* =========================
       INVENTORY
    ========================= */

    // 🔥 PRODUCT MASTER (style → erp_sku)
    const pm = productRaw.filter(r => r.style_id == styleId);

    const erpSet = new Set(pm.map(r => r.erp_sku));

    let launch_date = pm[0]?.launch_date || "";
    let live_date = pm[0]?.live_date || "";
    let tp = Number(pm[0]?.tp || 0);

    // 🔥 SELLER STOCK (via erp_sku)
    let seller_stock = 0;
    sellerRaw.forEach(r => {
        if (erpSet.has(r.erp_sku)){
            seller_stock += Number(r.units || 0);
        }
    });

    // 🔥 SJIT
    let sjit_stock = 0;
    sjitRaw.forEach(r => {
        if (r.style_id == styleId){
            sjit_stock += Number(r.sellable_inventory_count || r.inventory_count || 0);
        }
    });

    // 🔥 SOR
    let sor_stock = 0;
    sorRaw.forEach(r => {
        if (r.style_id == styleId){
            sor_stock += Number(r.units || 0);
        }
    });

    const total_stock = sjit_stock + sor_stock + seller_stock;

    /* =========================
       INSIGHTS
    ========================= */

    const insights = [];

    if (clicks > 100 && cvr < 0.01){
        insights.push({ type: "bad", text: "Low CVR → Improve PDP" });
    }

    if (ad_spend > 5000 && roi < 1.5){
        insights.push({ type: "bad", text: "Inefficient spend → Reduce ads" });
    }

    if (ctr > 0.03 && cvr < 0.01){
        insights.push({ type: "warning", text: "Traffic mismatch" });
    }

    if (roi > 3 && cvr > 0.02){
        insights.push({ type: "good", text: "Strong performer → Scale" });
    }

    if (impressions < 1000){
        insights.push({ type: "warning", text: "Low visibility" });
    }

    if (ad_spend === 0 && units > 0){
        insights.push({ type: "good", text: "Organic traction → Start ads" });
    }

    // 🔥 STOCK INSIGHTS
    const dailySales = units / 30;
    const daysCover = dailySales ? total_stock / dailySales : 0;

    if (daysCover < 7){
        insights.push({ type: "bad", text: "Low stock → Replenish urgently" });
    } else if (daysCover > 60){
        insights.push({ type: "warning", text: "Overstock risk" });
    }

    /* =========================
       SCORE
    ========================= */

    let score = 0;

    if (roi >= 3) score += 30;
    else if (roi >= 2) score += 22;
    else if (roi >= 1) score += 15;
    else score += 5;

    if (cvr >= 0.03) score += 25;
    else if (cvr >= 0.02) score += 18;
    else if (cvr >= 0.01) score += 10;
    else score += 5;

    if (ctr >= 0.03) score += 20;
    else if (ctr >= 0.02) score += 15;
    else if (ctr >= 0.01) score += 10;
    else score += 5;

    if (units > 50) score += 25;
    else if (units > 20) score += 15;
    else score += 5;

    let label = "Poor";
    if (score >= 80) label = "Excellent";
    else if (score >= 60) label = "Good";
    else if (score >= 40) label = "Average";

    /* =========================
       MOMENTUM
    ========================= */

    const momentum = calculateMomentum(trend);

    /* =========================
       RETURN
    ========================= */

    return {
        style_id: styleId,
        brand: s[0].brand,

        kpi: {
            units,
            revenue,
            asp,
            ad_spend,
            ad_revenue,
            roi,
            impressions,
            clicks,
            cvr
        },

        traffic: {
            impressions,
            clicks,
            atc,
            orders: units
        },

        inventory: {
            sjit: sjit_stock,
            sor: sor_stock,
            seller: seller_stock,
            total: total_stock,
            days_cover: daysCover
        },

        product: {
            launch_date,
            live_date,
            tp
        },

        trend,
        insights,

        score: {
            value: score,
            label
        },

        momentum
    };
}

/* ========================= */

function calculateMomentum(trend){

    const keys = Object.keys(trend).sort();

    if (keys.length < 14){
        return { value: 0, label: "Stable" };
    }

    const last7 = keys.slice(-7);
    const prev7 = keys.slice(-14, -7);

    const sum = (arr) =>
        arr.reduce((s,k)=> s + (trend[k]?.revenue || 0), 0);

    const recent = sum(last7);
    const previous = sum(prev7);

    if (!previous){
        return { value: 0, label: "Stable" };
    }

    const growth = (recent - previous) / previous;

    let label = "Stable";
    if (growth > 0.2) label = "Rising";
    else if (growth < -0.1) label = "Declining";

    return { value: growth, label };
}

/* ========================= */

function buildDate(r) {

    const monthMap = {
        JAN: "01", FEB: "02", MAR: "03", APR: "04",
        MAY: "05", JUN: "06", JUL: "07", AUG: "08",
        SEP: "09", OCT: "10", NOV: "11", DEC: "12"
    };

    const day = String(r.date || 1).padStart(2, "0");
    const month = monthMap[(r.month || "").toUpperCase()] || "01";

    return `${r.year}-${month}-${day}`;
}