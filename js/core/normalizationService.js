/* =========================
   🔥 NORMALIZATION SERVICE
========================= */

export function normalizeData(key, data) {

    // Safety check
    if (!data || !Array.isArray(data)) return [];

    switch (key) {

        /* =========================
           ADS DATA (CDR)
        ========================= */
        case "CDR":
            return data.map(r => ({
                ...r,
                ad_spend: num(r.ad_spend),
                impressions: num(r.impressions || r.views),
                clicks: num(r.clicks),
                total_revenue: num(r.total_revenue || r.total_revenue_(rs.)),
                direct_units_sold: num(r.direct_units_sold),
                indirect_units_sold: num(r.indirect_units_sold)
            }));

        /* =========================
           PLACEMENT DATA (PPR)
        ========================= */
        case "PPR":
            return data.map(r => ({
                ...r,
                impressions: num(r.impressions || r.views),
                clicks: num(r.clicks),
                budget_spend: num(r.budget_spend || r.ad_spend),

                units_sold_direct: num(r.units_sold_direct),
                units_sold_indirect: num(r.units_sold_indirect),

                direct_revenue: num(r.direct_revenue),
                indirect_revenue: num(r.indirect_revenue)
            }));

        /* =========================
           SALES DATA
        ========================= */
        case "SALES":
            return data.map(r => ({
                ...r,
                final_amount: num(r.final_amount),
                qty: num(r.qty)
            }));

        /* =========================
           TRAFFIC
        ========================= */
        case "TRAFFIC":
            return data.map(r => ({
                ...r,
                impressions: num(r.impressions),
                clicks: num(r.clicks)
            }));

        /* =========================
           DEFAULT (SAFE PASS)
        ========================= */
        default:
            return data;
    }
}

/* =========================
   🔧 HELPER
========================= */

function num(v){
    return Number(v || 0);
}