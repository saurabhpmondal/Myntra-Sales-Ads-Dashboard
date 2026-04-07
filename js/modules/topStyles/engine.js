import { getData } from "../../core/dataRegistry.js";

export function buildTopStylesData(){

    const raw = getData("SALES") || [];
    if (!raw.length) return [];

    const state = window.APP_STATE || {};
    const brandFilter = state.brand;

    // 🔥 MONTH MAP (SAFE)
    const monthMap = {
        JAN:1, FEB:2, MAR:3, APR:4,
        MAY:5, JUN:6, JUL:7, AUG:8,
        SEP:9, OCT:10, NOV:11, DEC:12
    };

    // 🔥 EXTRACT VALID MONTH-YEAR COMBINATIONS
    const monthSet = new Set();

    raw.forEach(r => {
        const m = monthMap[(r.month || "").trim().toUpperCase()];
        const y = Number(r.year);

        if (m && y){
            monthSet.add(`${y}-${m}`);
        }
    });

    // 🔥 SORT MONTHS (LATEST LAST)
    const sorted = Array.from(monthSet)
        .map(v => {
            const [y,m] = v.split("-").map(Number);
            return { y, m };
        })
        .sort((a,b) => a.y === b.y ? a.m - b.m : a.y - b.y);

    if (!sorted.length) return [];

    const current = sorted[sorted.length - 1];
    const previous = sorted[sorted.length - 2] || null;

    const map = {};

    raw.forEach(r => {

        const m = monthMap[(r.month || "").trim().toUpperCase()];
        const y = Number(r.year);

        if (!r.style_id || !m || !y) return;
        if (brandFilter && r.brand !== brandFilter) return;

        const key = r.style_id;

        if (!map[key]) {
            map[key] = {
                style_id: key,
                brand: r.brand || "",
                units: 0,
                revenue: 0,
                last_units: 0,
                last_revenue: 0
            };
        }

        // 🔥 CURRENT MONTH
        if (m === current.m && y === current.y){
            map[key].units += Number(r.qty || 0);
            map[key].revenue += Number(r.final_amount || 0);
        }

        // 🔥 LAST MONTH (IF EXISTS)
        if (previous && m === previous.m && y === previous.y){
            map[key].last_units += Number(r.qty || 0);
            map[key].last_revenue += Number(r.final_amount || 0);
        }
    });

    const result = Object.values(map).map(r => {

        // 🔥 PROJECTION (SAFE DEFAULT)
        const projected = r.units * 2; // simple scaling, stable

        let remark = "";
        let className = "";

        // 🔥 KEY FIX
        if (r.last_units === 0){
            remark = "▲ Grow";
            className = "kpi-good";
        }
        else if (projected > r.last_units){
            remark = "▲ Grow";
            className = "kpi-good";
        } else {
            remark = "▼ Degrow";
            className = "kpi-bad";
        }

        return {
            ...r,
            projected_units: projected,
            remark,
            className
        };
    });

    // 🔥 SORT BY CURRENT UNITS
    return result.sort((a,b) => b.units - a.units);
}