let currentLimit = 10;
let currentBrand = "ALL";

export function renderTopStyles(data){

    const container = document.getElementById("reportContainer");

    // 🔥 UNIQUE BRANDS
    const brands = [...new Set(data.map(d => d.brand).filter(Boolean))];

    container.innerHTML = `
        <div class="card table-card">

            <h3>Top Styles</h3>

            <!-- 🔥 FILTERS -->
            <div style="display:flex;gap:12px;margin-bottom:12px;flex-wrap:wrap">

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
                    <label style="font-size:12px;color:#6b7280">Top N</label>
                    <select id="topNSelect">
                        ${option(10)}
                        ${option(20)}
                        ${option(50)}
                        ${option(100)}
                    </select>
                </div>

            </div>

            <!-- TABLE -->
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
                            <th>Remark</th>
                        </tr>
                    </thead>
                    <tbody id="topStylesBody"></tbody>
                </table>
            </div>

        </div>
    `;

    renderRows(data);

    // 🔥 EVENTS

    document.getElementById("topNSelect").onchange = function(){
        currentLimit = Number(this.value);
        renderRows(data);
    };

    document.getElementById("brandSelect").onchange = function(){
        currentBrand = this.value;
        renderRows(data);
    };
}

/* ---------- RENDER ROWS ---------- */

function renderRows(data){

    let filtered = data;

    // 🔥 BRAND FILTER
    if (currentBrand !== "ALL"){
        filtered = filtered.filter(d => d.brand === currentBrand);
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
                <td class="${r.className}">${r.remark}</td>
            </tr>
        `).join("");

    document.getElementById("topStylesBody").innerHTML = rows;
}

/* ---------- HELPERS ---------- */

function option(n){
    return `<option value="${n}" ${n===10?"selected":""}>${n}</option>`;
}

function fmt(n){
    return Number(n || 0).toLocaleString();
}