let currentBrand = "ALL";

export function renderDayWise(data){

    const container = document.getElementById("reportContainer");

    const brands = [...new Set(data.rows.map(r=>r.brand).filter(Boolean))];

    container.innerHTML = `
        <div class="card table-card">

            <h3>Day Wise Sales (${data.monthLabel})</h3>

            <div class="top-style-filters">
                <select id="dwBrand">
                    <option value="ALL">All Brands</option>
                    ${brands.map(b=>`<option>${b}</option>`).join("")}
                </select>
            </div>

            <div class="table-wrapper daywise-wrapper">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Style</th>
                            <th>Total</th>
                            ${buildDaysHeader(data.days)}
                        </tr>
                    </thead>
                    <tbody id="dwBody"></tbody>
                </table>
            </div>

        </div>
    `;

    renderRows(data);

    document.getElementById("dwBrand").onchange = e=>{
        currentBrand = e.target.value;
        renderRows(data);
    };
}

function renderRows(data){

    let rows = data.rows;

    if (currentBrand !== "ALL"){
        rows = rows.filter(r=>r.brand === currentBrand);
    }

    const html = rows.map(r=>`
        <tr>
            <td>${r.style_id}</td>
            <td>${fmt(r.total)}</td>
            ${r.days.map(v=>`<td>${v||0}</td>`).join("")}
        </tr>
    `).join("");

    document.getElementById("dwBody").innerHTML = html;
}

function buildDaysHeader(n){
    let h="";
    for(let i=1;i<=n;i++){
        h+=`<th>${i}</th>`;
    }
    return h;
}

function fmt(n){ return Number(n||0).toLocaleString(); }