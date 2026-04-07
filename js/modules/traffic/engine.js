import { getData } from "../../core/dataRegistry.js";

export function buildTrafficData(){

    const raw = getData("TRAFFIC") || [];

    const state = window.APP_STATE || {};
    const from = state.from;
    const to = state.to;
    const brand = state.brand;

    if (!raw.length) return [];

    // 🔥 FIND LATEST WEEK
    let latest = raw[0];
    raw.forEach(r => {
        if (r.end_date > latest.end_date) {
            latest = r;
        }
    });

    const latestStart = latest.start_date;
    const latestEnd = latest.end_date;

    const data = raw.filter(r => {

        const start = r.start_date;
        const end = r.end_date;

        // 🔥 DEFAULT → latest week only
        if (!from && !to) {
            if (start !== latestStart || end !== latestEnd) return false;
        }

        // 🔥 FILTER → overlap logic
        if (from && end < from) return false;
        if (to && start > to) return false;

        if (brand && r.brand && r.brand !== brand) return false;

        return true;
    });

    const map = {};

    data.forEach(r => {

        const key = r.style_id || "Unknown";

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

        // 🔥 FIXED (NO EVENT TYPE)
        map[key].atc += Number(r.atc || 0);
        map[key].orders += Number(r.orders || 0);
    });

    Object.values(map).forEach(r => {
        r.ctr = r.impressions ? r.clicks / r.impressions : 0;
        r.cvr = r.clicks ? r.orders / r.clicks : 0;
    });

    return {
        rows: Object.entries(map)
            .sort((a,b)=>b[1].impressions - a[1].impressions),

        // 🔥 PASS PERIOD INFO
        period: {
            start: latestStart,
            end: latestEnd
        }
    };
}