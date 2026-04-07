let currentLimit = 10;
let currentBrand = "ALL";
let searchText = "";

export function renderTopStyles(data){

    console.log("NEW UI LOADED"); // 🔥 DEBUG

    const container = document.getElementById("reportContainer");

    const brands = [...new Set(data.map(d => d.brand).filter(Boolean))];

    container.innerHTML = `
        <div class="card table-card">

            <h3>Top Styles</h3>

            <!-- FILTERS -->
            <div style="display:flex;gap:12px;margin-bottom:12px;flex-wrap:wrap">

                <!-- SEARCH -->
                <div>
                    <label style="font-size:12px;color:#6b7280">Search</label>
                    <input id="styleSearch" placeholder="Search style..."
                        style="padding:8px;border:1px solid #ccc;border-radius:6px;" />
                </div>

                <!-- BRAND -->
                <div>
                    <label style="font-size:12px;color:#6b7280">Brand</label>
                    <select id="brandSelect">
                        <option value="ALL">All</option>
                        ${brands.map(b => `<option value="${b}">${b}</option>`).join("")}
                    </select>
                </div>

                <!-- TOP N -->
                <div>
                    <label style="font-size:12px;color:#6b7280">Top</label>
                    <select id="topNSelect">
                        ${opt(10)}${opt(20)}${opt(50)}${opt(100)}
                    </select>
                </div>

            </div>

            <div class="table-wrapper">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Style</th>
                            <th>Brand</th>
                            <th>Units</th>
                            <th>Revenue</th>
                            <th>Last Units</th>
                            <th>Last Revenue</th>
                            <th>% Growth</th>
                            <th>Remark</th>
                        </tr>
                    </thead>
                    <tbody id="topStylesBody"></tbody>
                </table>
            </div>

        </div>
    `;

    renderRows(data);

    document.getElementById("topNSelect").onchange = e=>{
        currentLimit = Number(e.target.value);
        renderRows(data);
    };

    document.getElementById("brandSelect").onchange = e=>{
        currentBrand = e.target.value;
        renderRows(data);
    };

    document.getElementById("styleSearch").oninput = e=>{
        searchText = e.target.value.toLowerCase();
        renderRows(data);
    };
}

function renderRows(data){

    let filtered = data;

    if (currentBrand !== "ALL"){
        filtered = filtered.filter(d => d.brand === currentBrand);
    }

    if (searchText){
        filtered = filtered.filter(d =>
            String(d.style_id).toLowerCase().includes(searchText)
        );
    }

    const rows = filtered
        .slice(0, currentLimit)
        .map(r => `
            <tr>
                <td>${r.style_id}</td>
                <td>${r.brand}</td>
                <td>${fmt(r.units)}</td>
                <td>${fmt(r.revenue)}</td>
                <td>${fmt(r.last_units)}</td>
                <td>${fmt(r.last_revenue)}</td>
                <td class="${growthClass(r.growth)}">${pct(r.growth)}</td>
                <td class="${r.className}">${r.remark}</td>
            </tr>
        `).join("");

    document.getElementById("topStylesBody").innerHTML = rows;
}

function opt(n){
    return `<option value="${n}" ${n===10?"selected":""}>${n}</option>`;
}

function fmt(n){ return Number(n||0).toLocaleString(); }
function pct(n){ return (n||0).toFixed(1)+"%"; }

function growthClass(n){
    if (n > 0) return "kpi-good";
    if (n < 0) return "kpi-bad";
    return "";
}