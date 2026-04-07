import { getData } from "../../core/dataRegistry.js";

export function buildStyleIntelligence(styleId){

    const SALES = getData("SALES") || [];
    const TRAFFIC = getData("TRAFFIC") || [];
    const CPR = getData("CPR") || [];

    /* ======================
       🔥 MONTH MAP
    ====================== */
    const monthMap = {
        JAN:1, FEB:2, MAR:3, APR:4,
        MAY:5, JUN:6, JUL:7, AUG:8,
        SEP:9, OCT:10, NOV:11, DEC:12
    };

    /* ======================
       🔥 CURRENT MONTH (SALES)
    ====================== */
    let monthSet = new Set();

    SALES.forEach(r=>{
        const m = monthMap[(r.month||"").trim().toUpperCase()];
        const y = Number(r.year);
        if(m && y) monthSet.add(`${y}-${m}`);
    });

    const sortedMonths = Array.from(monthSet)
        .map(v=>{
            const [y,m] = v.split("-").map(Number);
            return {y,m};
        })
        .sort((a,b)=> a.y===b.y ? a.m-b.m : a.y-b.y);

    const current = sortedMonths[sortedMonths.length-1];
    const previous = sortedMonths[sortedMonths.length-2] || null;

    /* ======================
       🔥 SALES
    ====================== */
    let units = 0;
    let revenue = 0;
    let last_units = 0;
    let last_revenue = 0;
    let brand = "";

    const trend = {};

    SALES.forEach(r=>{

        if(r.style_id !== styleId) return;

        const m = monthMap[(r.month||"").trim().toUpperCase()];
        const y = Number(r.year);

        if(!brand) brand = r.brand || "";

        // current
        if(m===current.m && y===current.y){
            units += Number(r.qty||0);
            revenue += Number(r.final_amount||0);
        }

        // last
        if(previous && m===previous.m && y===previous.y){
            last_units += Number(r.qty||0);
            last_revenue += Number(r.final_amount||0);
        }

        // trend
        const key = `${y}-${String(m).padStart(2,"0")}-${String(r.date).padStart(2,"0")}`;
        if(!trend[key]){
            trend[key] = { units:0, revenue:0 };
        }

        trend[key].units += Number(r.qty||0);
        trend[key].revenue += Number(r.final_amount||0);
    });

    const asp = units ? revenue/units : 0;

    /* ======================
       🔥 CPR (ADS)
    ====================== */
    let ad_spend = 0;
    let ad_revenue = 0;

    CPR.forEach(r=>{
        if(r.product_id !== styleId) return;

        ad_spend += Number(r.spend||0);
        ad_revenue += Number(r.revenue||0);
    });

    const roi = ad_spend ? ad_revenue/ad_spend : 0;

    /* ======================
       🔥 TRAFFIC (LATEST WEEK)
    ====================== */
    let latestStart = "";

    TRAFFIC.forEach(r=>{
        if(r.style_id !== styleId) return;
        if(!latestStart || r.start_date > latestStart){
            latestStart = r.start_date;
        }
    });

    let impressions = 0;
    let clicks = 0;
    let atc = 0;
    let orders = 0;

    TRAFFIC.forEach(r=>{
        if(r.style_id !== styleId) return;
        if(r.start_date !== latestStart) return;

        impressions += Number(r.impressions||0);
        clicks += Number(r.clicks||0);
        atc += Number(r.atc||0);
        orders += Number(r.orders||0);
    });

    const cvr = clicks ? orders/clicks : 0;

    /* ======================
       🔥 GROWTH
    ====================== */
    const growth = last_units
        ? ((units - last_units)/last_units)*100
        : 100;

    return {
        style_id: styleId,
        brand,

        kpi:{
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

        trend,
        traffic:{ impressions, clicks, atc, orders },

        comparison:{
            units,
            last_units,
            growth
        }
    };
}