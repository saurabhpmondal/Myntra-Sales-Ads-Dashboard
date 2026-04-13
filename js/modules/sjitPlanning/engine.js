// reports/sjitPlanning/engine.js

import { getData } from "../../core/dataRegistry.js";

export function buildSJITPlanning(){

    const orders = getData("PO_Seller_Orders_Report") || [];
    const returns = getData("PO_Seller_Returns_Report") || [];
    const sjit = getData("sjit_stock") || [];
    const traffic = getData("TRAFFIC") || [];
    const pm = getData("product_master") || [];

    const styleSet = new Set();

    orders.forEach(r => styleSet.add(r.style_id));
    sjit.forEach(r => styleSet.add(r.style_id));

    const styles = Array.from(styleSet);

    const returnSet = new Set(
        returns.map(r => r.order_line_id)
    );

    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - 1);

    const currentMonthDays = baseDate.getDate();

    const lastMonth = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        0
    );

    const lastMonthDays = lastMonth.getDate();

    const totalDays = currentMonthDays + lastMonthDays;

    const NORTH = [
        "DELHI","HARYANA","PUNJAB","UTTAR PRADESH","RAJASTHAN",
        "CHANDIGARH","JAMMU AND KASHMIR","UTTARAKHAND","HIMACHAL PRADESH"
    ];

    const SOUTH = [
        "KARNATAKA","TAMIL NADU","TELANGANA","ANDHRA PRADESH",
        "KERALA","PUDUCHERRY"
    ];

    const result = [];

    styles.forEach(style_id => {

        const o = orders.filter(r => r.style_id == style_id);

        const gross = o.length;

        let ret = 0;

        o.forEach(r => {
            if (returnSet.has(r.order_line_id)) ret++;
        });

        const net = gross - ret;

        const returnPct = gross ? ret / gross : 0;

        const drr = net ? net / totalDays : 0;

        const adjDRR = drr * (1 - returnPct);

        let sjitStock = 0;

        sjit.forEach(r => {
            if (r.style_id == style_id){
                sjitStock += Number(r.sellable_inventory_count || 0);
            }
        });

        const sc = drr ? sjitStock / drr : 0;

        const target45 = drr * 45;

        let shipment = target45 - sjitStock;
        if (shipment < 0) shipment = 0;

        let recall = 0;

        if (sc >= 60){
            const target60 = drr * 60;
            recall = sjitStock - target60;
            if (recall < 0) recall = 0;
        }

        const p = pm.find(x => x.style_id == style_id) || {};
        const t = traffic.find(x => x.style_id == style_id) || {};

        /* =========================
           PPMP / SJIT SHARE
        ========================= */

        let ppmp = 0;
        let sjitOrd = 0;

        o.forEach(r => {
            const po = (r.po_type || "").toUpperCase();

            if (po.includes("PPMP")) ppmp++;
            else sjitOrd++;
        });

        const ppmpShare = gross ? (ppmp / gross) : 0;
        const sjitShare = gross ? (sjitOrd / gross) : 0;

        /* =========================
           ZONE
        ========================= */

        let north = 0;
        let south = 0;

        o.forEach(r => {

            const st = (r.state || "").toUpperCase().trim();

            if (NORTH.includes(st)) north++;
            else if (SOUTH.includes(st)) south++;
            else {
                north += 0.5;
                south += 0.5;
            }
        });

        let zone = "Balanced";

        if (north > south) zone = "North";
        if (south > north) zone = "South";

        result.push({
            style_id,
            brand: p.brand,
            erp_sku: p.erp_sku,
            status: p.status,
            rating: Number(t.rating || 0),

            gross,
            return: ret,
            return_pct: returnPct,
            net,

            ppmp_share: ppmpShare,
            sjit_share: sjitShare,
            zone,

            drr,
            adj_drr: adjDRR,

            sjit: sjitStock,
            sc,

            shipment: Math.round(shipment),
            recall: Math.round(recall)
        });
    });

    return result;
}