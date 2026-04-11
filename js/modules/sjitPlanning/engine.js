import { getData } from "../../core/dataRegistry.js";

export function buildSJITPlanning(){

    const orders = getData("PO_Seller_Orders_Report") || [];
    const returns = getData("PO_Seller_Returns_Report") || [];
    const sjit = getData("sjit_stock") || [];
    const traffic = getData("TRAFFIC") || [];
    const pm = getData("product_master") || [];

    /* =========================
       UNIQUE STYLE LIST
    ========================= */

    const styleSet = new Set();

    orders.forEach(r => styleSet.add(r.style_id));
    sjit.forEach(r => styleSet.add(r.style_id));

    const styles = Array.from(styleSet);

    /* =========================
       RETURNS MAP
    ========================= */

    const returnSet = new Set(
        returns.map(r => r.order_line_id)
    );

    /* =========================
       DAYS CALCULATION
    ========================= */

    const today = new Date();
    const currentMonthDays = today.getDate();

    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    const lastMonthDays = lastMonth.getDate();

    const totalDays = currentMonthDays + lastMonthDays;

    /* =========================
       BUILD DATA
    ========================= */

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

        // 🔥 KEEP (NO DELETE)
        const adjDRR = drr * (1 - returnPct);

        /* =========================
           STOCK
        ========================= */

        let sjitStock = 0;
        sjit.forEach(r => {
            if (r.style_id == style_id){
                sjitStock += Number(r.sellable_inventory_count || 0);
            }
        });

        // 🔥 FIXED SC (CORRECT FORMULA)
        const sc = drr ? sjitStock / drr : 0;

        /* =========================
           SHIPMENT (FIXED)
        ========================= */

        const target = drr * 45;
        let shipment = target - sjitStock;
        if (shipment < 0) shipment = 0;

        /* =========================
           RECALL (FIXED)
        ========================= */

        let recall = 0;
        if (sc >= 90){
            recall = sjitStock - target;
            if (recall < 0) recall = 0;
        }

        /* =========================
           META
        ========================= */

        const p = pm.find(x => x.style_id == style_id) || {};
        const t = traffic.find(x => x.style_id == style_id) || {};

        /* =========================
           FLAGS
        ========================= */

        let remark = "";
        if (net === 0 && sjitStock > 0){
            remark = "HIGH RISK";
        }

        /* =========================
           PRIORITY
        ========================= */

        let priority = "LOW";

        if (remark === "HIGH RISK") priority = "HIGH";
        else if (shipment > 500) priority = "HIGH";
        else if (shipment > 200) priority = "MEDIUM";
        else if (recall > 200) priority = "MEDIUM";

        /* =========================
           ACTION
        ========================= */

        let action = "";

        if (remark === "HIGH RISK") action = "STOP BUY";
        else if (shipment > 0) action = "REPLENISH";
        else if (recall > 0) action = "REDUCE STOCK";
        else if (returnPct > 0.3) action = "FIX PRODUCT";

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

            drr,
            adj_drr: adjDRR,

            sjit: sjitStock,
            sc,

            shipment: Math.round(shipment),
            recall: Math.round(recall),

            priority,
            action,
            remark
        });
    });

    return result;
}