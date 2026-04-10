import { getData } from "../../core/dataRegistry.js";

export function buildSJIOPlanning(){

    const orders = getData("PO_Seller_Orders_Report") || [];
    const returns = getData("PO_Seller_Returns_Report") || [];
    const traffic = getData("TRAFFIC") || [];
    const sjit = getData("sjit_stock") || [];
    const product = getData("product_master") || [];

    /* =========================
       🔥 RETURN MAP
    ========================= */

    const returnMap = {};
    returns.forEach(r=>{
        if (!r.order_line_id) return;
        returnMap[r.order_line_id] = true;
    });

    /* =========================
       🔥 STYLE BASE MAP
    ========================= */

    const map = {};

    orders.forEach(r => {

        const style = (r.style_id || "").toString().trim();

        // ❌ REMOVE INVALID STYLE
        if (!style || isNaN(style)) return;

        if (!map[style]){
            map[style] = {
                style_id: style,
                brand: r.brand || "",
                gross: 0,
                returns: 0,
                states: {}
            };
        }

        map[style].gross += 1;

        if (returnMap[r.order_line_id]){
            map[style].returns += 1;
        }

        // zone tracking
        if (r.state){
            map[style].states[r.state] = true;
        }
    });

    /* =========================
       🔥 TRAFFIC MAP
    ========================= */

    const trafficMap = {};
    traffic.forEach(r=>{
        if (!r.style_id) return;

        if (!trafficMap[r.style_id]){
            trafficMap[r.style_id] = {
                rating: 0,
                count: 0
            };
        }

        if (r.rating){
            trafficMap[r.style_id].rating += Number(r.rating);
            trafficMap[r.style_id].count += 1;
        }
    });

    /* =========================
       🔥 SJIT MAP
    ========================= */

    const sjitMap = {};
    sjit.forEach(r=>{
        if (!r.style_id) return;

        if (!sjitMap[r.style_id]){
            sjitMap[r.style_id] = 0;
        }

        sjitMap[r.style_id] += Number(r.sellable_inventory_count || 0);
    });

    /* =========================
       🔥 PRODUCT MAP
    ========================= */

    const productMap = {};
    product.forEach(r=>{
        if (!r.style_id) return;

        productMap[r.style_id] = {
            erp_sku: r.erp_sku,
            brand: r.brand,
            status: (r.status || "").toLowerCase(),
            tp: r.tp
        };
    });

    /* =========================
       🔥 FINAL BUILD
    ========================= */

    const result = Object.values(map).map(r=>{

        const net = r.gross - r.returns;
        const returnPct = r.gross ? (r.returns / r.gross) * 100 : 0;

        // DRR (calendar days)
        const days = 30; // safe default
        const drr = net / days;

        const sjitStock = sjitMap[r.style_id] || 0;

        const sc = drr ? (sjitStock / drr) : 0;

        let shipment = Math.max(0, (45 * drr) - sjitStock);
        let recall = sc >= 90 ? "YES" : "NO";

        const prod = productMap[r.style_id] || {};
        const ratingObj = trafficMap[r.style_id] || {};

        const rating = ratingObj.count
            ? (ratingObj.rating / ratingObj.count)
            : 0;

        let remarks = [];

        /* =========================
           🔥 BUSINESS RULES
        ========================= */

        if (returnPct > 45){
            remarks.push("High Return");
        }

        if (sc >= 90){
            shipment = 0;
            remarks.push("Recall Required");
        }

        if (prod.status === "discontinued"){
            shipment = 0;
            remarks.push("Discontinued - Do Not Ship");
        }

        if (prod.status === "special"){
            shipment = 0;
            remarks.push("Special Category - Restricted");
        }

        if (r.gross === 0 && sjitStock > 0){
            remarks.push("High Risk");
        }

        return {
            style_id: r.style_id,
            brand: prod.brand || r.brand || "-",
            erp_sku: prod.erp_sku || "-",
            status: prod.status || "-",
            rating: rating,

            gross: r.gross,
            returns: r.returns,
            returnPct: returnPct,

            net,
            drr,

            sjit: sjitStock,
            sc,

            shipment,
            recall,

            remark: remarks.join(" | ")
        };
    });

    /* =========================
       🔥 SORTING
    ========================= */

    result.sort((a,b)=> b.shipment - a.shipment);

    return result;
}