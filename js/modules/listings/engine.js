import { getData } from "../../core/dataRegistry.js";

export function buildListingsData(){

    const sales = getFiltered("SALES");
    const ads = getFiltered("CPR");
    const traffic = getFiltered("TRAFFIC");

    const map = {};

    // SALES
    sales.forEach(r => {

        const key = r.style_id;

        if (!map[key]) init(map, key);

        map[key].brand = r.brand;
        map[key].gmv += Number(r.final_amount || 0);
        map[key].units += Number(r.qty || 0);
    });

    // ADS
    ads.forEach(r => {

        const key = r.product_id;

        if (!map[key]) init(map, key);

        map[key].spend += Number(r.spend || 0);
        map[key].revenue += Number(r.revenue || 0);
    });

    // TRAFFIC
    traffic.forEach(r => {

        const key = r.style_id || r.sku;

        if (!map[key]) init(map, key);

        map[key].impressions += Number(r.impressions || 0);
        map[key].clicks += Number(r.clicks || 0);
    });

    // DERIVED
    Object.values(map).forEach(r => {
        r.roi = r.spend ? r.revenue / r.spend : 0;
    });

    // SORT BY GMV
    return Object.entries(map)
        .sort((a,b)=>b[1].gmv - a[1].gmv);
}

/* ---------- FILTER ---------- */

function getFiltered(dataset){

    const raw = getData(dataset) || [];

    const state = window.APP_STATE || {};
    const from = state.from;
    const to = state.to;
    const brand = state.brand;

    return raw.filter(r => {

        if (dataset === "SALES") {
            const d = buildDate(r);
            if (from && d < from) return false;
            if (to && d > to) return false;
        }

        if (dataset !== "SALES") {
            const d = r.date;
            if (d) {
                if (from && d < from) return false;
                if (to && d > to) return false;
            }
        }

        if (brand && r.brand && r.brand !== brand) return false;

        return true;
    });
}

function buildDate(r){
    const map = {
        JAN:"01",FEB:"02",MAR:"03",APR:"04",MAY:"05",
        JUN:"06",JUNE:"06",JUL:"07",AUG:"08",SEP:"09",
        OCT:"10",NOV:"11",DEC:"12"
    };

    const day = String(r.date).padStart(2,"0");
    const month = map[(r.month||"").toUpperCase()] || "01";

    return `${r.year}-${month}-${day}`;
}

function init(map,key){
    map[key] = {
        brand:"",
        gmv:0,
        units:0,
        spend:0,
        revenue:0,
        impressions:0,
        clicks:0
    };
}