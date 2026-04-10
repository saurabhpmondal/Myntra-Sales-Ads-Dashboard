export function normalizeData(dataset, rows) {

    if (dataset === "SALES") {
        return rows.map(r => ({
            brand: r.brand,
            style_id: r.style_id,
            po_type: r.po_type,
            qty: Number(r.qty) || 0,
            final_amount: Number(r.final_amount) || 0,
            date: r.date,
            month: r.month,
            year: r.year
        }));
    }

    if (dataset === "CDR") {
        return rows.map(r => {

            const raw = (r.date || "").toString();
            let formattedDate = "";

            if (raw.length === 8) {
                formattedDate = `${raw.slice(0,4)}-${raw.slice(4,6)}-${raw.slice(6,8)}`;
            }

            return {
                impressions: Number(r.impressions) || 0,
                clicks: Number(r.clicks) || 0,
                ad_spend: Number(r.ad_spend) || 0,

                direct_units_sold: Number(r.units_sold_direct) || 0,
                indirect_units_sold: Number(r.units_sold_indirect) || 0,
                units_sold_total: Number(r.units_sold_total) || 0,

                direct_revenue: Number(r.direct_revenue) || 0,
                indirect_revenue: Number(r.indirect_revenue) || 0,
                total_revenue: Number(r.total_revenue) || 0,

                roi_direct: Number(r.roi_direct) || 0,
                roi_indirect: Number(r.roi_indirect) || 0,
                roi_total: Number(r.roi_total) || 0,

                campaign_name: r.campaign_name,
                adgroup_name: r.adgroup_name,
                adgroup_id: r.adgroup_id,

                date: formattedDate
            };
        });
    }

    if (dataset === "CPR") {
        return rows.map(r => ({
            product_id: r.product_id,
            product_name: r.product_name,
            brand: r.brand,
            spend: Number(r.budget_spend) || 0,
            revenue: Number(r.total_revenue) || 0,
            units: Number(r.units_sold_total) || 0
        }));
    }

    if (dataset === "PPR") {
        return rows.map(r => ({
            placement: r.placement,

            campaign_name: r.campaign_name,
            campaign_id: r.campaign_id,
            adgroup_name: r.adgroup_name,
            adgroup_id: r.adgroup_id,

            spend: Number(r.budget_spend) || 0,
            revenue: Number(r.total_revenue) || 0,
            clicks: Number(r.clicks) || 0,
            impressions: Number(r.impressions) || 0,
            month: r.month,

            direct_units_sold: Number(r.units_sold_direct) || 0,
            indirect_units_sold: Number(r.units_sold_indirect) || 0,
            units_sold_total: Number(r.units_sold_total) || 0,

            direct_revenue: Number(r.direct_revenue) || 0,
            indirect_revenue: Number(r.indirect_revenue) || 0,
            roi_total: Number(r.roi_total) || 0
        }));
    }

    if (dataset === "TRAFFIC") {
        return rows.map(r => ({
            style_id: r.style_id,
            brand: r.brand,

            impressions: Number(r.impressions) || 0,
            clicks: Number(r.clicks) || 0,
            add_to_carts: Number(r.add_to_carts) || 0,
            purchases: Number(r.purchases) || 0,

            // 🔥 FIX FOR ENGINE
            add_to_cart: Number(r.add_to_carts) || 0,

            atc: Number(r.add_to_carts) || 0,
            orders: Number(r.purchases) || 0,

            // 🔥 NEW (CRITICAL)
            rating: Number(r.rating) || 0
        }));
    }

    /* =========================================================
       🔥 NEW DATASETS (ONLY ADDED — NO TOUCH ABOVE)
    ========================================================= */

    if (dataset === "sjit_stock") {
        return rows.map(r => ({
            style_id: r.style_id,
            sellable_inventory_count: Number(r.sellable_inventory_count) || 0,
            inventory_count: Number(r.inventory_count) || 0
        }));
    }

    if (dataset === "sor_stock") {
        return rows.map(r => ({
            style_id: r.style_id,
            units: Number(r.units) || 0
        }));
    }

    if (dataset === "seller_stock") {
        return rows.map(r => ({
            erp_sku: r.erp_sku,
            units: Number(r.units) || 0
        }));
    }

    if (dataset === "product_master") {
        return rows.map(r => ({
            style_id: r.style_id,
            erp_sku: r.erp_sku,
            launch_date: r.launch_date,
            live_date: r.live_date,
            tp: Number(r.tp) || 0,

            // 🔥 NEW (CRITICAL FIX)
            brand: r.brand,
            status: r.status
        }));
    }

    /* =========================================================
       🔥 PO DATASETS (SAFE ADD — HANDLES BOTH HEADER TYPES)
    ========================================================= */

    if (dataset === "PO_Seller_Orders_Report") {
        return rows.map(r => ({
            style_id: (r.style_id || r["style id"] || "").toString().trim(),
            brand: r.brand,
            state: (r.state || "").toString().trim(),
            order_line_id: (r.order_line_id || r["order line id"] || "").toString().trim()
        }));
    }

    if (dataset === "PO_Seller_Returns_Report") {
        return rows.map(r => ({
            order_line_id: (r.order_line_id || r["order line id"] || "").toString().trim()
        }));
    }

    return rows;
}