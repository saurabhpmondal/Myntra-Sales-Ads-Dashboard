import { getData } from "../../core/dataRegistry.js";

export function buildAlerts(){

    const alerts = [];

    const cdr = getData("CDR") || [];

    const state = window.APP_STATE || {};
    const from = state.from;
    const to = state.to;

    const data = cdr.filter(r=>{
        const d = r.date;
        if (!d) return false;
        if (from && d < from) return false;
        if (to && d > to) return false;
        return true;
    });

    const map = {};

    data.forEach(r=>{

        const key = r.campaign_name;

        if(!map[key]){
            map[key] = {
                spend:0,
                revenue:0,
                impressions:0,
                clicks:0,
                units:0
            };
        }

        map[key].spend += Number(r.ad_spend || 0);
        map[key].revenue += Number(r.total_revenue || 0);
        map[key].impressions += Number(r.impressions || 0);
        map[key].clicks += Number(r.clicks || 0);
        map[key].units += Number(r.total_units || 0);
    });

    Object.entries(map).forEach(([name,r])=>{

        const roi = r.spend ? r.revenue / r.spend : 0;
        const ctr = r.impressions ? r.clicks / r.impressions : 0;
        const cvr = r.clicks ? r.units / r.clicks : 0;

        // 🔴 Spend Waste
        if (r.spend > 10000 && roi < 1){
            alerts.push({
                type:"Spend Waste",
                report:"Campaign",
                entity:name,
                metric:"ROI",
                value:roi,
                issue:"Low return",
                action:"Reduce budget",
                severity:"HIGH"
            });
        }

        // 🟢 Scaling
        if (roi > 4 && r.spend > 5000){
            alerts.push({
                type:"Scaling",
                report:"Campaign",
                entity:name,
                metric:"ROI",
                value:roi,
                issue:"High return",
                action:"Increase budget",
                severity:"LOW"
            });
        }

        // 🟡 CTR vs CVR
        if (ctr > 0.03 && cvr < 0.01){
            alerts.push({
                type:"CTR-CVR Gap",
                report:"Campaign",
                entity:name,
                metric:"CVR",
                value:cvr,
                issue:"Poor conversion",
                action:"Fix listing",
                severity:"MEDIUM"
            });
        }

        // 🟡 Low Visibility
        if (r.impressions < 1000){
            alerts.push({
                type:"Low Visibility",
                report:"Campaign",
                entity:name,
                metric:"Impressions",
                value:r.impressions,
                issue:"Low reach",
                action:"Increase bids",
                severity:"MEDIUM"
            });
        }
    });

    // SORT: HIGH → MEDIUM → LOW
    const priority = {HIGH:1, MEDIUM:2, LOW:3};

    alerts.sort((a,b)=>{
        return priority[a.severity] - priority[b.severity];
    });

    return alerts;
}