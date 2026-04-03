import { getData, getFilter } from "../../core/stateManager.js";
import { applyDateFilter } from "../../filters/engine.js";

let cached = [];

export function buildListings() {

    if (cached.length) return cached;

    let sales = getData("SALES");
    let ads = getData("CDR");
    let traffic = getData("TRAFFIC");

    const filter = getFilter();

    sales = applyDateFilter(sales, filter);
    ads = applyDateFilter(ads, filter);

    const map = {};

    // SALES
    sales.forEach(r => {
        const key = r.style_id || "unknown";

        if (!map[key]) map[key] = baseObj(key);

        map[key].gmv += r.revenue;
        map[key].units += r.units;
        map[key].brand = r.brand;
    });

    // ADS
    ads.forEach(r => {
        const key = r.style_id || "unknown";

        if (!map[key]) map[key] = baseObj(key);

        map[key].spend += r.spend;
        map[key].adRevenue += r.revenue;
    });

    // TRAFFIC
    traffic.forEach(r => {
        const key = r.style_id || "unknown";

        if (!map[key]) map[key] = baseObj(key);

        map[key].impressions += r.impressions;
        map[key].clicks += r.clicks;
    });

    cached = Object.values(map);
    return cached;
}

function baseObj(id) {
    return {
        style: id,
        brand: "",
        gmv: 0,
        units: 0,
        spend: 0,
        adRevenue: 0,
        impressions: 0,
        clicks: 0
    };
}