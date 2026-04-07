import { getData } from "../../core/dataRegistry.js";

export function buildTopStylesData(){

    const raw = getData("SALES") || [];

    if (!raw.length) return [];

    const state = window.APP_STATE || {};
    const brandFilter = state.brand;

    const today = new Date();

    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const lastMonthDate = new Date(currentYear, currentMonth - 2, 1);
    const lastMonth = lastMonthDate.getMonth() + 1;
    const lastMonthYear = lastMonthDate.getFullYear();

    const daysPassed = today.getDate();
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    // 🔥 FIX: MONTH MAP
    const monthMap = {
        JAN:1, FEB:2, MAR:3, APR:4,
        MAY:5, JUN:6, JUL:7, AUG:8,
        SEP:9, OCT:10, NOV:11, DEC:12
    };

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