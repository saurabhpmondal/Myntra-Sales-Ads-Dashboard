let currentLimit = 10;
let currentBrand = "ALL";
let searchText = "";

export function renderTopStyles(data){

    const container = document.getElementById("reportContainer");
    const brands = [...new Set(data.map(d => d.brand).filter(Boolean))];

    container.innerHTML = `
        <div class="card table-card">

            <h3>Top Styles</h3>

            <div class="top-style-filters compact">

                <input id="styleSearch" class="compact-input" placeholder="Search style..." />

                <select id="brandSelect" class="compact-select">
                    <option value="ALL">All Brands</option>
                    ${brands.map(b => `<option value="${b}">${b}</option>`).join("")}
                </select>

                <select id="topNSelect" class="compact-select small">
                    ${opt(10)}${opt(20)}${opt(50)}${opt(100)}
                </select>

                <button id="exportTop50Btn" class="compact-btn">Export Top 50</button>

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

    document.getElementById("exportTop50Btn").onclick = ()=>{
        exportTop50(data);
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

function exportTop50(data){

    let filtered = data;

    if (currentBrand !== "ALL"){
        filtered = filtered.filter(d => d.brand === currentBrand);
    }

    const rows = filtered.slice(0, 50);

    const headers = ["style_id","brand","units","revenue","last_units","last_revenue","growth"];

    const csv = [
        headers.join(","),
        ...rows.map(r => [
            r.style_id,
            r.brand,
            r.units,
            r.revenue,
            r.last_units,
            r.last_revenue,
            r.growth
        ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "top-50-styles.csv";
    a.click();
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