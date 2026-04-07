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
            // 🔥 EXISTING (UNCHANGED)
            placement: r.placement,
            spend: Number(r.budget_spend) || 0,
            revenue: Number(r.total_revenue) || 0,
            clicks: Number(r.clicks) || 0,
            impressions: Number(r.impressions) || 0,
            month: r.month,

            // 🔥 ADDED (FOR UNITS FIX)
            direct_units_sold: Number(r.units_sold_direct) || 0,
            indirect_units_sold: Number(r.units_sold_indirect) || 0,
            units_sold_total: Number(r.units_sold_total) || 0,

            // 🔥 ADDED (FOR REVENUE + ROI)
            direct_revenue: Number(r.direct_revenue) || 0,
            indirect_revenue: Number(r.indirect_revenue) || 0,
            roi_total: Number(r.roi_total) || 0
        }));
    }

    if (dataset === "TRAFFIC") {
        return rows.map(r => ({
            // 🔥 EXISTING
            style_id: r.style_id,
            brand: r.brand,
            impressions: Number(r.impressions) || 0,
            clicks: Number(r.clicks) || 0,
            add_to_carts: Number(r.add_to_carts) || 0,
            purchases: Number(r.purchases) || 0,

            // 🔥 ALIAS FIX (CRITICAL)
            atc: Number(r.add_to_carts) || 0,
            orders: Number(r.purchases) || 0
        }));
    }

    return rows;
}