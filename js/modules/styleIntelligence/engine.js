import { getData } from "../../core/dataRegistry.js";

export function buildStyleIntelligence(styleId){

    const sales = getData("SALES") || [];
    const ads = getData("CDR") || [];
    const traffic = getData("TRAFFIC") || [];

    const s = sales.filter(r => r.style_id == styleId);
    if (!s.length) return null;

    const a = ads.filter(r => r.style_id == styleId);
    const t = traffic.filter(r => r.style_id == styleId);

    let units = 0;
    let revenue = 0;

    s.forEach(r => {
        units += Number(r.qty || 0);
        revenue += Number(r.final_amount || 0);
    });

    const asp = units ? revenue / units : 0;

    let ad_spend = 0;
    let ad_revenue = 0;

    a.forEach(r => {
        ad_spend += Number(r.ad_spend || 0);
        ad_revenue += Number(r.total_revenue || 0);
    });

    const roi = ad_spend ? ad_revenue / ad_spend : 0;

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
       🔥 INSIGHTS
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

    /* =========================
       🔥 SCORE SYSTEM
    ========================= */

    let score = 0;

    // ROI
    if (roi >= 3) score += 30;
    else if (roi >= 2) score += 22;
    else if (roi >= 1) score += 15;
    else score += 5;

    // CVR
    if (cvr >= 0.03) score += 25;
    else if (cvr >= 0.02) score += 18;
    else if (cvr >= 0.01) score += 10;
    else score += 5;

    // CTR
    if (ctr >= 0.03) score += 20;
    else if (ctr >= 0.02) score += 15;
    else if (ctr >= 0.01) score += 10;
    else score += 5;

    // Momentum (units)
    if (units > 50) score += 25;
    else if (units > 20) score += 15;
    else score += 5;

    let label = "Poor";
    if (score >= 80) label = "Excellent";
    else if (score >= 60) label = "Good";
    else if (score >= 40) label = "Average";

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

        insights,

        score: {
            value: score,
            label
        }
    };
}