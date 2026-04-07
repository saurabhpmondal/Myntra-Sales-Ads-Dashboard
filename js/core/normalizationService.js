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

            // 🔥 DATE FIX
            const raw = (r.date || "").toString();
            let formattedDate = "";

            if (raw.length === 8) {
                formattedDate = `${raw.slice(0,4)}-${raw.slice(4,6)}-${raw.slice(6,8)}`;
            }

            // 🔥 SAFE EXTRACTION
            const dUnits = Number(r.units_sold_direct) || 0;
            const iUnits = Number(r.units_sold_indirect) || 0;

            const dRev = Number(r.direct_revenue) || 0;
            const iRev = Number(r.indirect_revenue) || 0;

            // 🔥 FINAL FALLBACK LOGIC (IMPORTANT)
            const totalUnits =
                Number(r.units_sold_total) ||
                (dUnits + iUnits);

            const totalRevenue =
                Number(r.total_revenue) ||
                (dRev + iRev);

            return {
                impressions: Number(r.impressions) || 0,
                clicks: Number(r.clicks) || 0,
                ad_spend: Number(r.ad_spend) || 0,

                // ✅ FIXED VALUES
                units_sold_total: totalUnits,
                total_revenue: totalRevenue,

                // ✅ KEEP EXTRA (future safe)
                direct_units: dUnits,
                indirect_units: iUnits,
                direct_revenue: dRev,
                indirect_revenue: iRev,

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
            month: r.month // 🔥 keep for placement filter
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