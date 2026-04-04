import { getData } from "../../core/dataRegistry.js";

export function buildTrafficData(){

    const raw = getData("TRAFFIC") || [];

    const state = window.APP_STATE || {};
    const from = state.from;
    const to = state.to;
    const brand = state.brand;

    const data = raw.filter(r => {

        const d = r.date;

        if (d){
            if (from && d < from) return false;
            if (to && d > to) return false;
        }

        if (brand && r.brand && r.brand !== brand) return false;

        return true;
    });

    const map = {};

    data.forEach(r => {

        const key = r.style_id || r.sku;

        if (!map[key]) {
            map[key] = {
                brand: r.brand || "",
                impressions: 0,
                clicks: 0,
                atc: 0,
                orders: 0
            };
        }

        map[key].impressions += Number(r.impressions || 0);
        map[key].clicks += Number(r.clicks || 0);

        if (r.event_type === "add_to_cart") {
            map[key].atc += Number(r.item_quantity || 0);
        }

        if (r.event_type === "purchase") {
            map[key].orders += Number(r.item_quantity || 0);
        }
    });

    Object.values(map).forEach(r => {
        r.ctr = r.impressions ? r.clicks / r.impressions : 0;
        r.cvr = r.clicks ? r.orders / r.clicks : 0;
    });

    return Object.entries(map)
        .sort((a,b)=>b[1].impressions - a[1].impressions);
}