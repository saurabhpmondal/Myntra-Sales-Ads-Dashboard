import { getData } from "../../core/dataRegistry.js";

export function buildPlacementData() {

    const raw = getData("PPR") || [];

    const map = {}; // existing placement table
    const campaignPlacementMap = {}; // 🔥 NEW

    const VALID = [
        "top of search",
        "rest of search",
        "top of pdp",
        "rest of pdp",
        "top of home",
        "rest of home"
    ];

    raw.forEach(r => {

        if (!r.campaign_name || !r.placement) return;

        const campaign = r.campaign_name.trim();

        const pRaw = r.placement.toString().trim().toLowerCase();
        if (!VALID.includes(pRaw)) return;

        const placement = pRaw.replace(/\b\w/g, c => c.toUpperCase());

        /* =========================
           ✅ EXISTING PLACEMENT MAP
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
           🔥 CAMPAIGN × PLACEMENT
        ========================= */

        const key = `${campaign}||${placement}`;

        if (!campaignPlacementMap[key]) {
            campaignPlacementMap[key] = {
                campaign,
                placement,
                impressions: 0,
                clicks: 0,
                spend: 0,
                revenue: 0,
                units: 0
            };
        }

        campaignPlacementMap[key].impressions += Number(r.impressions || 0);
        campaignPlacementMap[key].clicks += Number(r.clicks || 0);
        campaignPlacementMap[key].spend += Number(r.spend || 0);
        campaignPlacementMap[key].revenue += Number(r.revenue || 0);
        campaignPlacementMap[key].units += Number(r.units_sold_total || 0);
    });

    /* =========================
       METRICS CALCULATION
    ========================= */

    Object.values(map).forEach(r => {
        r.ctr = r.impressions ? r.clicks / r.impressions : 0;
        r.cpc = r.clicks ? r.spend / r.clicks : 0;
        r.roi = r.spend ? r.revenue / r.spend : 0;
    });

    const grouped = {};

    Object.values(campaignPlacementMap).forEach(r => {

        r.ctr = r.impressions ? r.clicks / r.impressions : 0;
        r.cvr = r.clicks ? r.units / r.clicks : 0;
        r.roi = r.spend ? r.revenue / r.spend : 0;

        if (!grouped[r.campaign]) grouped[r.campaign] = [];
        grouped[r.campaign].push(r);
    });

    /* =========================
       SORTING
    ========================= */

    const campaignPlacement = Object.entries(grouped)
        .map(([c, arr]) => {
            const totalSpend = arr.reduce((s,x)=>s + x.spend, 0);
            arr.sort((a,b)=> b.spend - a.spend);
            return [c, arr, totalSpend];
        })
        .sort((a,b)=> b[2] - a[2]);

    /* =========================
       FINAL RETURN (NO BREAK)
    ========================= */

    return {
        placement: map,                  // existing
        campaignPlacement: campaignPlacement // 🔥 NEW
    };
}