import { getData } from "../../core/dataRegistry.js";

export function buildTopStylesData(){

    const raw = getData("SALES") || [];

    if (!raw.length) return [];

    const state = window.APP_STATE || {};
    const brandFilter = state.brand;

    const today = new Date();

    const currentMonth = today.getMonth() + 1; // 1-12
    const currentYear = today.getFullYear();

    const lastMonthDate = new Date(currentYear, currentMonth - 2, 1);
    const lastMonth = lastMonthDate.getMonth() + 1;
    const lastMonthYear = lastMonthDate.getFullYear();

    const daysPassed = today.getDate();
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    const map = {};

    raw.forEach(r => {

        const m = Number(r.month);
        const y = Number(r.year);

        if (!r.style_id) return;

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

        // CURRENT MONTH
        if (m === currentMonth && y === currentYear){
            map[key].units += Number(r.qty || 0);
            map[key].revenue += Number(r.final_amount || 0);
        }

        // LAST MONTH
        if (m === lastMonth && y === lastMonthYear){
            map[key].last_units += Number(r.qty || 0);
            map[key].last_revenue += Number(r.final_amount || 0);
        }
    });

    const result = Object.values(map).map(r => {

        // 🔥 PROJECTION
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

    // 🔥 SORT BY CURRENT UNITS
    return result.sort((a,b) => b.units - a.units);
}