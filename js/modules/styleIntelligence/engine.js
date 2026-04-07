import { getData } from "../../core/dataRegistry.js";

export function buildStyleIntelligence(styleId){

    const sales = getData("SALES") || [];
    const ads = getData("CDR") || [];
    const traffic = getData("TRAFFIC") || [];

    /* ---------------- KPI ---------------- */

    let units = 0;
    let revenue = 0;
    let brand = "";

    sales.forEach(r=>{
        if (String(r.style_id) === String(styleId)){
            units += Number(r.qty || 0);
            revenue += Number(r.final_amount || 0);
            brand = r.brand;
        }
    });

    let ad_spend = 0;
    let ad_revenue = 0;
    let impressions = 0;
    let clicks = 0;

    ads.forEach(r=>{
        if (String(r.campaign_name || "").includes(styleId)){
            ad_spend += Number(r.ad_spend || 0);
            ad_revenue += Number(r.total_revenue || 0);
            impressions += Number(r.impressions || 0);
            clicks += Number(r.clicks || 0);
        }
    });

    let atc = 0;
    let orders = 0;

    traffic.forEach(r=>{
        if (String(r.style_id) === String(styleId)){
            atc += Number(r.atc || 0);
            orders += Number(r.orders || 0);
        }
    });

    const ctr = impressions ? clicks/impressions : 0;
    const cvr = clicks ? orders/clicks : 0;
    const roi = ad_spend ? ad_revenue/ad_spend : 0;

    /* ---------------- INSIGHTS ---------------- */

    const insights = [];

    // 🔥 HIGH ROI
    if (roi > 3){
        insights.push({
            type: "good",
            icon: "🚀",
            text: "High ROI → Scale Ads"
        });
    }

    // 🔥 LOW CTR
    if (ctr < 0.01){
        insights.push({
            type: "bad",
            icon: "❌",
            text: "Low CTR → Creative Issue"
        });
    }

    // 🔥 LOW CVR
    if (cvr < 0.02){
        insights.push({
            type: "warn",
            icon: "⚠",
            text: "Low CVR → PDP Issue"
        });
    }

    // 🔥 TRAFFIC BUT NO SALES
    if (clicks > 1000 && orders < 10){
        insights.push({
            type: "bad",
            icon: "📉",
            text: "Traffic Not Converting"
        });
    }

    return {
        style_id: styleId,
        brand,

        kpi:{
            units,
            revenue,
            ad_spend,
            ad_revenue,
            impressions,
            clicks,
            ctr,
            cvr,
            roi,
            asp: units ? revenue/units : 0
        },

        traffic:{
            impressions,
            clicks,
            atc,
            orders
        },

        insights
    };
}