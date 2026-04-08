import { getData } from "../../core/dataRegistry.js";

export function buildDayWiseData(){

    const raw = getData("SALES") || [];
    if (!raw.length) return { days: 0, rows: [], monthLabel: "" };

    // 🔥 month map
    const mMap = {JAN:1,FEB:2,MAR:3,APR:4,MAY:5,JUN:6,JUL:7,AUG:8,SEP:9,OCT:10,NOV:11,DEC:12};

    // 🔥 collect month-year combos
    const set = new Set();

    raw.forEach(r=>{
        const m = mMap[(r.month||"").trim().toUpperCase()];
        const y = Number(r.year);
        if (m && y) set.add(`${y}-${m}`);
    });

    if (!set.size) return { days: 0, rows: [], monthLabel: "" };

    // latest month
    const sorted = Array.from(set)
        .map(v=>{
            const [y,m]=v.split("-").map(Number);
            return {y,m};
        })
        .sort((a,b)=> a.y===b.y ? a.m-b.m : a.y-b.y);

    const cur = sorted[sorted.length-1];

    // days in month
    const daysInMonth = new Date(cur.y, cur.m, 0).getDate();

    // 🔥 map
    const map = {};

    raw.forEach(r=>{
        const m = mMap[(r.month||"").trim().toUpperCase()];
        const y = Number(r.year);
        if (m !== cur.m || y !== cur.y) return;

        const style = r.style_id;
        if (!style) return;

        if (!map[style]){
            map[style] = {
                style_id: style,
                brand: r.brand || "",
                total: 0,
                days: Array(daysInMonth).fill(0)
            };
        }

        const d = new Date(r.date);
        const day = d.getDate(); // 1–31

        const qty = Number(r.qty || 0);

        map[style].days[day-1] += qty;
        map[style].total += qty;
    });

    const rows = Object.values(map)
        .sort((a,b)=> b.total - a.total);

    const monthLabel = `${monthName(cur.m)} ${cur.y}`;

    return {
        days: daysInMonth,
        rows,
        monthLabel
    };
}

function monthName(m){
    return ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m];
}