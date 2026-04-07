let currentLimit = 10;
let currentBrand = "ALL";
let searchText = "";

export function renderTopStyles(data){

    const container = document.getElementById("reportContainer");

    const brands = [...new Set(data.map(d => d.brand).filter(Boolean))];

    container.innerHTML = `
        <div class="card table-card">

            <h3>Top Styles</h3>

            <!-- 🔥 FILTERS -->
            <div style="display:flex;gap:12px;margin-bottom:12px;flex-wrap:wrap">

                <!-- SEARCH -->
                <div>
                    <label style="font-size:12px;color:#6b7280">Search Style</label>
                    <input id="styleSearch" placeholder="Enter style id..."
                        style="padding:8px;border:1px solid #d1d5db;border-radius:6px;" />
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
                    <label style="font-size:12px;color:#6b7280">Top N</label>
                    <select id="topNSelect">
                        ${option(10)}
                        ${option(20)}
                        ${option(50)}
                        ${option(100)}
                    </select>
                </div>

            </div>

            <!-- 🔥 TABLE -->
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

    // EVENTS

    document.getElementById("topNSelect").onchange = function(){
        currentLimit = Number(this.value);
        renderRows(data);
    };

    document.getElementById("brandSelect").onchange = function(){
        currentBrand = this.value;
        renderRows(data);
    };

    document.getElementById("styleSearch").oninput = function(){
        searchText = this.value.toLowerCase();
        renderRows(data);
    };
}

/* ---------- RENDER ---------- */

function renderRows(data){

    let filtered = data;

    // 🔥 BRAND FILTER
    if (currentBrand !== "ALL"){
        filtered = filtered.filter(d => d.brand === currentBrand);
    }

    // 🔥 SEARCH FILTER
    if (searchText){
        filtered = filtered.filter(d =>
            (d.style_id || "").toString().toLowerCase().includes(searchText)
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

/* ---------- HELPERS ---------- */

function option(n){
    return `<option value="${n}" ${n===10?"selected":""}>${n}</option>`;
}

function fmt(n){
    return Number(n || 0).toLocaleString();
}

function pct(n){
    return (n || 0).toFixed(1) + "%";
}

function growthClass(n){
    if (n > 0) return "kpi-good";
    if (n < 0) return "kpi-bad";
    return "";
}