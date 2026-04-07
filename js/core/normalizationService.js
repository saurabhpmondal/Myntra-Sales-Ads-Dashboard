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

            // 🔥 DATE FIX (same as your original)
            const raw = (r.date || "").toString();
            let formattedDate = "";

            if (raw.length === 8) {
                formattedDate = `${raw.slice(0,4)}-${raw.slice(4,6)}-${raw.slice(6,8)}`;
            }

            // 🔥 SAFE NUMBER PARSING (NO BREAK)
            const unitsTotalRaw = Number(r.units_sold_total);
            const revenueTotalRaw = Number(r.total_revenue);

            const directUnits = Number(r.units_sold_direct) || 0;
            const indirectUnits = Number(r.units_sold_indirect) || 0;

            const directRevenue = Number(r.direct_revenue) || 0;
            const indirectRevenue = Number(r.indirect_revenue) || 0;

            return {
                impressions: Number(r.impressions) || 0,
                clicks: Number(r.clicks) || 0,
                ad_spend: Number(r.ad_spend) || 0,

                // ✅ CRITICAL FIX (NO || BUG)
                units_sold_total: !isNaN(unitsTotalRaw)
                    ? unitsTotalRaw
                    : (directUnits + indirectUnits),

                total_revenue: !isNaN(revenueTotalRaw)
                    ? revenueTotalRaw
                    : (directRevenue + indirectRevenue),

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
            placement: r.placement,
            spend: Number(r.budget_spend) || 0,
            revenue: Number(r.total_revenue) || 0,
            clicks: Number(r.clicks) || 0,
            impressions: Number(r.impressions) || 0,
            month: r.month // 🔥 keep for placement
        }));
    }

    if (dataset === "TRAFFIC") {
        return rows.map(r => ({
            style_id: r.style_id,
            brand: r.brand,
            impressions: Number(r.impressions) || 0,
            clicks: Number(r.clicks) || 0,
            add_to_carts: Number(r.add_to_carts) || 0,
            purchases: Number(r.purchases) || 0
        }));
    }

    return rows;
}