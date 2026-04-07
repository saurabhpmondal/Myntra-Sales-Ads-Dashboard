/* =========================
   🔥 NORMALIZATION SERVICE (RESTORED SAFE VERSION)
========================= */

export function normalizeData(key, data) {

    // 🔒 Safety check
    if (!data || !Array.isArray(data)) return [];

    // ✅ DO NOTHING (PASS THROUGH)
    // Your engines already handle:
    // - column mapping
    // - number conversion
    // - calculations

    return data;
}