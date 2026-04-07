export function normalizeData(key, data) {

    // 🔥 SAFETY: always return array
    if (!data || !Array.isArray(data)) return [];

    // 🔥 CURRENT STRATEGY → PASS THROUGH
    // (since your engines already handle column logic)

    return data;
}