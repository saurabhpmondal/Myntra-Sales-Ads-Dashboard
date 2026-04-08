import { getData } from "../../core/dataRegistry.js";

export function buildDayWiseData(){

    const raw = getData("SALES") || [];
    if (!raw.length) return { months: [], dataMap: {} };

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

    const months = Array.from(monthSet)
        .map(v=>{
            const [y,m]=v.split("-").map(Number);
            return {y,m,label:`${monthName(m)} ${y}`};
        })
        .sort((a,b)=> a.y===b.y ? b.m-a.m : b.y-a.y);

    const dataMap = {};

    months.forEach(mo=>{

        const daysInMonth = new Date(mo.y, mo.m, 0).getDate();
        const map = {};

        raw.forEach(r=>{

            const m = mMap[(r.month||"").trim().toUpperCase()];
            const y = Number(r.year);

            if (m !== mo.m || y !== mo.y) return;

            const style = r.style_id;
            if (!style) return;

            if (!map[style]){
                map[style] = {
                    style_id: style,
                    brand: r.brand || "",
                    po_type: r.po_type || "NA",
                    total: 0,
                    days: Array(daysInMonth).fill(0)
                };
            }

            const parts = (r.date || "").split("-");
            const day = Number(parts[0]);

            const qty = Number(r.qty || 0);

            if (day >=1 && day <= daysInMonth){
                map[style].days[day-1] += qty;
                map[style].total += qty;
            }
        });

        const rows = Object.values(map).map(r=>{

            const activeDays = r.days.filter(d=>d>0).length;
            const totalDays = r.days.length;

            const consistency = totalDays ? (activeDays/totalDays)*100 : 0;

            // 🔥 Momentum
            let momentum = 0;

            if (totalDays >= 6){
                const last3 = avg(r.days.slice(-3));
                const prev3 = avg(r.days.slice(-6,-3));
                momentum = prev3 ? ((last3-prev3)/prev3)*100 : 0;
            } else {
                const half = Math.floor(totalDays/2);
                const last = avg(r.days.slice(half));
                const prev = avg(r.days.slice(0,half));
                momentum = prev ? ((last-prev)/prev)*100 : 0;
            }

            // 🔥 Trend
            let trend = "→";
            if (momentum > 20) trend = "↑";
            else if (momentum < -20) trend = "↓";

            return {
                ...r,
                activeDays,
                consistency,
                momentum,
                trend
            };
        });

        dataMap[`${mo.y}-${mo.m}`] =
            rows.sort((a,b)=> b.total - a.total);
    });

    return { months, dataMap };
}

function avg(arr){
    if (!arr.length) return 0;
    return arr.reduce((a,b)=>a+b,0)/arr.length;
}

function monthName(m){
    return ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m];
}