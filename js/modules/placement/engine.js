import { getData } from "../../core/dataRegistry.js";

export function buildPlacementData() {

    const raw = getData("PPR") || [];

    const state = window.APP_STATE || {};

    /* =========================
       🔥 MONTH SELECTION LOGIC
    ========================= */

    let selectedMonth = state.month;

    // fallback → pick latest month from data
    if (!selectedMonth) {

        const months = [...new Set(raw.map(r => (r.month || "").toUpperCase()))]
            .filter(Boolean)
            .sort();

        selectedMonth = months[months.length - 1]; // latest
    }

    /* =========================
       FILTER BY MONTH ONLY
    ========================= */

    const filtered = raw.filter(r =>
        (r.month || "").toUpperCase() === selectedMonth
    );

    const map = {};
    const cpMap = {};

    // 🔥 VALID PLACEMENTS
    const VALID = [
        "top of search",
        "rest of search",
        "top of pdp",
        "rest of pdp",
        "top of home",
        "rest of home"
    ];

    filtered.forEach(r => {

        const pRaw = (r.placement || "").toString().trim().toLowerCase();
        if (!VALID.includes(pRaw)) return;

        const placement = pRaw.replace(/\b\w/g, c => c.toUpperCase());

        /* =========================
           EXISTING LOGIC (UNCHANGED)
        ========================= */

        if (!map[placement]) {
            map[placement] = {
                impressions: 0,
                clicks: 0,
                spend: 0,
                revenue: 0,
                direct_units: 0,
                indirect_units: 0,
                total_units: 0
            };
        }

        map[placement].impressions += Number(r.impressions || 0);
        map[placement].clicks += Number(r.clicks || 0);
        map[placement].spend += Number(r.spend || 0);
        map[placement].revenue += Number(r.revenue || 0);
        map[placement].direct_units += Number(r.direct_units_sold || 0);
        map[placement].indirect_units += Number(r.indirect_units_sold || 0);
        map[placement].total_units += Number(r.units_sold_total || 0);

        /* =========================
           CAMPAIGN × PLACEMENT
        ========================= */

        if (!r.campaign_name) return;

        const campaign = r.campaign_name.trim();
        const key = `${campaign}||${placement}`;

        if (!cpMap[key]) {
            cpMap[key] = {
                campaign,
                placement,
                impressions: 0,
                clicks: 0,
                spend: 0,
                revenue: 0,
                units: 0
            };
        }

        cpMap[key].impressions += Number(r.impressions || 0);
        cpMap[key].clicks += Number(r.clicks || 0);
        cpMap[key].spend += Number(r.spend || 0);
        cpMap[key].revenue += Number(r.revenue || 0);
        cpMap[key].units += Number(r.units_sold_total || 0);
    });

    /* =========================
       EXISTING METRICS
    ========================= */

    Object.values(map).forEach(r => {
        r.ctr = r.impressions ? r.clicks / r.impressions : 0;
        r.cpc = r.clicks ? r.spend / r.clicks : 0;
        r.roi = r.spend ? r.revenue / r.spend : 0;

        // UI expects units
        r.units = r.total_units;
    });

    /* =========================
       GROUP CAMPAIGN × PLACEMENT
    ========================= */

    const grouped = {};

    Object.values(cpMap).forEach(r => {

        r.ctr = r.impressions ? r.clicks / r.impressions : 0;
        r.cvr = r.clicks ? r.units / r.clicks : 0;
        r.roi = r.spend ? r.revenue / r.spend : 0;

        if (!grouped[r.campaign]) grouped[r.campaign] = [];
        grouped[r.campaign].push(r);
    });

    // sort inside campaign
    Object.values(grouped).forEach(arr => {
        arr.sort((a,b)=> b.spend - a.spend);
    });

    /* =========================
       ATTACH WITHOUT BREAKING
    ========================= */

    map._campaignPlacement = grouped;

    return map;
}