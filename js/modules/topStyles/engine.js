import { getData } from "../../core/dataRegistry.js";

export function buildTopStylesData(){

    const raw = getData("SALES") || [];
    if (!raw.length) return [];

    const state = window.APP_STATE || {};
    const brandFilter = state.brand;

    // 🔥 MONTH MAP
    const monthMap = {
        JAN:1, FEB:2, MAR:3, APR:4,
        MAY:5, JUN:6, JUL:7, AUG:8,
        SEP:9, OCT:10, NOV:11, DEC:12
    };

    // 🔥 FIND LATEST MONTH IN DATA
    let latestYear = 0;
    let latestMonth = 0;

    raw.forEach(r => {
        const m = monthMap[(r.month || "").toUpperCase()];
        const y = Number(r.year);

        if (!m || !y) return;

        if (y > latestYear || (y === latestYear && m > latestMonth)){
            latestYear = y;
            latestMonth = m;
        }
    });

    // 🔥 LAST MONTH CALC
    let lastMonth = latestMonth - 1;
    let lastMonthYear = latestYear;

    if (lastMonth === 0){
        lastMonth = 12;
        lastMonthYear -= 1;
    }

    const map = {};

    raw.forEach(r => {

        const m = monthMap[(r.month || "").toUpperCase()];
        const y = Number(r.year);

        if (!r.style_id || !m) return;
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

        // 🔥 CURRENT (LATEST DATA MONTH)
        if (m === latestMonth && y === latestYear){
            map[key].units += Number(r.qty || 0);
            map[key].revenue += Number(r.final_amount || 0);
        }

        // 🔥 LAST MONTH
        if (m === lastMonth && y === lastMonthYear){
            map[key].last_units += Number(r.qty || 0);
            map[key].last_revenue += Number(r.final_amount || 0);
        }
    });

    const daysPassed = 15; // 🔥 SAFE ASSUMPTION (mid-month)
    const daysInMonth = 30;

    const result = Object.values(map).map(r => {

        const projected = daysPassed ? (r.units / daysPassed) * daysInMonth : 0;

        let remark = "";
        let className = "";

        if (projected > r.last_units){
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

    return result.sort((a,b) => b.units - a.units);
}