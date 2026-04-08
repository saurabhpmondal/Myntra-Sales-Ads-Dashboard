let currentBrand = "ALL";
let currentMonth = "";
let currentPO = "ALL";
let visibleCount = 50;

export function renderDayWise(payload){

    const { months, dataMap } = payload;

    if (!months.length){
        document.getElementById("reportContainer").innerHTML =
            `<div style="padding:20px">No Data</div>`;
        return;
    }

    currentMonth = `${months[0].y}-${months[0].m}`;

    const allRows = Object.values(dataMap).flat();

    const brands = [...new Set(allRows.map(r=>r.brand).filter(Boolean))];
    const poTypes = [...new Set(allRows.map(r=>r.po_type).filter(Boolean))];

    const container = document.getElementById("reportContainer");

    container.innerHTML = `
        <div class="card table-card">

            <h3>Day Wise Sales</h3>

            <div class="top-style-filters">

                <select id="dwMonth">
                    ${months.map(m=>`
                        <option value="${m.y}-${m.m}">
                            ${m.label}
                        </option>`).join("")}
                </select>

                <select id="dwBrand">
                    <option value="ALL">All Brands</option>
                    ${brands.map(b=>`<option>${b}</option>`).join("")}
                </select>

                <select id="dwPO">
                    <option value="ALL">All PO</option>
                    ${poTypes.map(p=>`<option>${p}</option>`).join("")}
                </select>

            </div>

            <div id="dwTable"></div>

            <div style="text-align:center; margin-top:10px;">
                <button id="loadMoreBtn">Load More</button>
            </div>

        </div>
    `;

    renderTable(dataMap);

    /* EVENTS */

    document.getElementById("dwMonth").onchange = e=>{
        currentMonth = e.target.value;
        visibleCount = 50;
        renderTable(dataMap);
    };

    document.getElementById("dwBrand").onchange = e=>{
        currentBrand = e.target.value;
        visibleCount = 50;
        renderTable(dataMap);
    };

    document.getElementById("dwPO").onchange = e=>{
        currentPO = e.target.value;
        visibleCount = 50;
        renderTable(dataMap);
    };

    document.getElementById("loadMoreBtn").onclick = ()=>{
        visibleCount += 50;
        renderTable(dataMap);
    };
}

/* ---------- TABLE ---------- */

function renderTable(dataMap){

    let rows = dataMap[currentMonth] || [];

    if (currentBrand !== "ALL"){
        rows = rows.filter(r=>r.brand === currentBrand);
    }

    if (currentPO !== "ALL"){
        rows = rows.filter(r=>r.po_type === currentPO);
    }

    const visible = rows.slice(0, visibleCount);

    const days = visible[0]?.days?.length || 0;

    const html = `
        <div class="table-wrapper daywise-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th>Style</th>
                        <th>Total</th>
                        ${buildDays(days)}
                    </tr>
                </thead>
                <tbody>
                    ${visible.map(r=>row(r)).join("")}
                </tbody>
            </table>
        </div>
    `;

    document.getElementById("dwTable").innerHTML = html;
}

function row(r){

    let html = `
        <tr>
            <td>${r.style_id}</td>
            <td>${fmt(r.total)}</td>
    `;

    for(let i=0;i<r.days.length;i++){

        const val = r.days[i];
        const prev = i>0 ? r.days[i-1] : null;

        let cls = "";

        if (prev !== null){
            if (val > prev) cls = "dw-up";
            else if (val < prev) cls = "dw-down";
        }

        html += `<td class="${cls}">${val}</td>`;
    }

    html += `</tr>`;
    return html;
}

function buildDays(n){
    let h="";
    for(let i=1;i<=n;i++){
        h+=`<th>${i}</th>`;
    }
    return h;
}

function fmt(n){
    return Number(n||0).toLocaleString();
}