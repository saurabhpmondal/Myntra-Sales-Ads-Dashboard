let currentBrand = "ALL";

export function renderDayWise(months){

    const container = document.getElementById("reportContainer");

    const allRows = months.flatMap(m=>m.rows);
    const brands = [...new Set(allRows.map(r=>r.brand).filter(Boolean))];

    container.innerHTML = `
        <div class="card table-card">

            <h3>Day Wise Sales</h3>

            <div class="top-style-filters">
                <select id="dwBrand">
                    <option value="ALL">All Brands</option>
                    ${brands.map(b=>`<option>${b}</option>`).join("")}
                </select>
            </div>

            <div id="dwContainer"></div>

        </div>
    `;

    renderMonths(months);

    document.getElementById("dwBrand").onchange = e=>{
        currentBrand = e.target.value;
        renderMonths(months);
    };
}

/* ---------- MONTH RENDER ---------- */

function renderMonths(months){

    const html = months.map((m,i)=>{

        let rows = m.rows;

        if (currentBrand !== "ALL"){
            rows = rows.filter(r=>r.brand === currentBrand);
        }

        return `
            <div class="dw-month">

                <div class="dw-header" data-index="${i}">
                    ${m.isOpen ? "▼" : "▶"} ${m.label}
                </div>

                <div class="dw-body" style="display:${m.isOpen?"block":"none"}">
                    ${table(m.days, rows)}
                </div>

            </div>
        `;
    }).join("");

    document.getElementById("dwContainer").innerHTML = html;

    document.querySelectorAll(".dw-header").forEach(el=>{
        el.onclick = ()=>{
            const idx = Number(el.dataset.index);
            months[idx].isOpen = !months[idx].isOpen;
            renderMonths(months);
        };
    });
}

/* ---------- TABLE ---------- */

function table(days, rows){

    return `
        <div class="table-wrapper daywise-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th>Style</th>
                        <th>Total</th>
                        ${buildDaysHeader(days)}
                    </tr>
                </thead>
                <tbody>
                    ${rows.map(r=>row(r, days)).join("")}
                </tbody>
            </table>
        </div>
    `;
}

function row(r, days){

    let html = `
        <tr>
            <td>${r.style_id}</td>
            <td>${fmt(r.total)}</td>
    `;

    for(let i=0;i<days;i++){

        const val = r.days[i] || 0;
        const prev = i>0 ? (r.days[i-1]||0) : null;

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

function buildDaysHeader(n){
    let h="";
    for(let i=1;i<=n;i++){
        h+=`<th>${i}</th>`;
    }
    return h;
}

function fmt(n){
    return Number(n||0).toLocaleString();
}