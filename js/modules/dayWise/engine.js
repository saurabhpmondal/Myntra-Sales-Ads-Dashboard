import { getData } from "../../core/dataRegistry.js";

export function buildDayWiseData(){

    const raw = getData("SALES") || [];
    if (!raw.length) return [];

    const mMap = {
        JAN:1,FEB:2,MAR:3,APR:4,MAY:5,JUN:6,
        JUL:7,AUG:8,SEP:9,OCT:10,NOV:11,DEC:12
    };

    const monthSet = new Set();

    raw.forEach(r=>{
        const m = mMap[(r.month||"").trim().toUpperCase()];
        const y = Number(r.year);
        if (m && y) monthSet.add(`${y}-${m}`);
    });

    const sorted = Array.from(monthSet)
        .map(v=>{
            const [y,m]=v.split("-").map(Number);
            return {y,m};
        })
        .sort((a,b)=> a.y===b.y ? b.m-a.m : b.y-a.y); // latest first

    const today = new Date().getDate();

    return sorted.map((cur, index)=>{

        const daysInMonth = new Date(cur.y, cur.m, 0).getDate();

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

            // ✅ DD-MM-YYYY parsing
            const parts = (r.date || "").split("-");
            const day = Number(parts[0]); // <-- FIXED

            const qty = Number(r.qty || 0);

            if (day >=1 && day <= daysInMonth){
                map[style].days[day-1] += qty;
                map[style].total += qty;
            }
        });

        let rows = Object.values(map)
            .sort((a,b)=> b.total - a.total);

        // ✅ CURRENT MONTH → CUT FUTURE DAYS
        if (index === 0){
            rows.forEach(r=>{
                r.days = r.days.slice(0, today);
            });
        }

        return {
            label: `${monthName(cur.m)} ${cur.y}`,
            isOpen: index === 0,
            days: index === 0 ? today : daysInMonth,
            rows
        };
    });
}

function monthName(m){
    return ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m];
}