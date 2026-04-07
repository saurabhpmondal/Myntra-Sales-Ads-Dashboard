/* =========================
   🔥 NORMALIZATION SERVICE (SAFE MODE)
   - No structure changes
   - No key renaming
   - Only light numeric cleanup
========================= */

export function normalizeData(key, data) {

    // Safety
    if (!data || !Array.isArray(data)) return [];

    return data.map(row => {

        const r = { ...row };

        // 🔢 convert only obvious numeric fields if present
        convert(r, "ad_spend");
        convert(r, "budget_spend");
        convert(r, "impressions");
        convert(r, "views");
        convert(r, "clicks");

        convert(r, "direct_units_sold");
        convert(r, "indirect_units_sold");
        convert(r, "units_sold_direct");
        convert(r, "units_sold_indirect");
        convert(r, "units_sold_total");

        convert(r, "direct_revenue");
        convert(r, "indirect_revenue");
        convert(r, "total_revenue");
        convert(r, "total_revenue_(rs.)");

        convert(r, "final_amount");
        convert(r, "qty");

        return r;
    });
}

/* =========================
   🔧 HELPER
========================= */

function convert(obj, key){
    if (obj[key] !== undefined && obj[key] !== "") {
        obj[key] = Number(obj[key]) || 0;
    }
}