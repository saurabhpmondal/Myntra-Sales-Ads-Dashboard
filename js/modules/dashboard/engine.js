import { getData } from "../core/dataRegistry.js";

export function buildKPIData(){

    const sales = getData("SALES") || [];
    const ads = getData("CDR") || [];

    if (!sales.length){
        return {
            kpi:{},
            brandMap:{}
        };
    }

    /* ---------------------------
       🔥 MONTH DETECTION
    --------------------------- */

    const monthMap = {
        JAN:1,FEB:2,MAR:3,APR:4,MAY:5,JUN:6,
        JUL:7,AUG:8,SEP:9,OCT:10,NOV:11,DEC:12
    };

    const monthSet = new Set();

    sales.forEach(r=>{
        const m = monthMap[(r.month||"").trim().toUpperCase()];
        const y = Number(r.year);
        if (m && y) monthSet.add(`${y}-${m}`);
    });

    const sorted = Array.from(monthSet)
        .map(v=>{
            const [y,m]=v.split("-").map(Number);
            return {y,m};
        })
        .sort((a,b)=> a.y===b.y ? a.m-b.m : a.y-b.y);

    const current = sorted[sorted.length-1];

    /* ---------------------------
       🔥 FILTER SALES
    --------------------------- */

    const filteredSales = sales.filter(r=>{
        const m = monthMap[(r.month||"").trim().toUpperCase()];
        const y = Number(r.year);
        return m === current.m && y === current.y;
    });

    /* ---------------------------
       🔥 KPI SALES
    --------------------------- */

    let gmv = 0;
    let units = 0;

    filteredSales.forEach(r=>{
        gmv += Number(r.final_amount || 0);
        units += Number(r.qty || 0);
    });

    const asp = units ? gmv / units : 0;

    /* ---------------------------
       🔥 FILTER ADS (CDR)
    --------------------------- */

    const filteredAds = ads.filter(r=>{

        const raw = (r.date || "").toString();

        if (raw.length !== 8) return false;

        const y = Number(raw.slice(0,4));
        const m = Number(raw.slice(4,6));

        return m === current.m && y === current.y;
    });

    let spend = 0;
    let revenue = 0;

    filteredAds.forEach(r=>{
        spend += Number(r.ad_spend || 0);
        revenue += Number(r.total_revenue || 0);
    });

    const roi = spend ? revenue / spend : 0;

    /* ---------------------------
       🔥 BRAND MAP
    --------------------------- */

    const brandMap = {};

    filteredSales.forEach(r=>{

        const b = r.brand || "UNKNOWN";

        if (!brandMap[b]){
            brandMap[b] = {
                gmv:0,
                units:0,
                PPMP:0,
                SJIT:0,
                SOR:0
            };
        }

        brandMap[b].gmv += Number(r.final_amount || 0);
        brandMap[b].units += Number(r.qty || 0);
    });

    /* ---------------------------
       🔥 FINAL RETURN
    --------------------------- */

    return {
        kpi:{
            gmv,
            units,
            asp,
            spend,
            revenue,
            roi
        },
        brandMap
    };
}