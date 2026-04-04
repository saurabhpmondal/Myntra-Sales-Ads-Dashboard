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
        return rows.map(r => ({
            impressions: Number(r.impressions) || 0,
            clicks: Number(r.clicks) || 0,
            ad_spend: Number(r.ad_spend) || 0,
            total_revenue: Number(r.total_revenue) || 0,
            units_sold_total: Number(r.units_sold_total) || 0,
            campaign_name: r.campaign_name,
            date: r.date,
            month: r.month
        }));
    }

    if (dataset === "CPR") {
        return rows.map(r => ({
            product_id: r.product_id,
            product_name: r.product_name,
            spend: Number(r.budget_spend) || 0,
            revenue: Number(r.total_revenue) || 0,
            units: Number(r.units_sold_total) || 0,
            campaign_name: r.campaign_name
        }));
    }

    if (dataset === "PPR") {
        return rows.map(r => ({
            placement: r.placement,
            spend: Number(r.budget_spend) || 0,
            revenue: Number(r.total_revenue) || 0,
            clicks: Number(r.clicks) || 0,
            impressions: Number(r.impressions) || 0
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