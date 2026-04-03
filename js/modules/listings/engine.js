import { getData, getFilter } from "../../core/stateManager.js";
import { applyDateFilter } from "../../filters/engine.js";

export function buildListings() {

    let sales = getData("SALES");
    let ads = getData("CPR"); // 🔥 use CPR instead of CDR

    const filter = getFilter();

    sales = applyDateFilter(sales, filter);

    const map = {};

    // SALES
    sales.forEach(r => {

        const key = r.style_id;

        if (!map[key]) {
            map[key] = {
                style: key,
                brand: r.brand,
                gmv: 0,
                units: 0,
                spend: 0,
                adRevenue: 0
            };
        }

        map[key].gmv += r.revenue;
        map[key].units += r.units;
    });

    // ADS (from CPR)
    ads.forEach(r => {

        const key = r.product_id;

        if (!map[key]) return;

        map[key].spend += r.spend;
        map[key].adRevenue += r.revenue;
    });

    // 🔥 SORT BY GMV
    return Object.values(map)
        .sort((a, b) => b.gmv - a.gmv);
}