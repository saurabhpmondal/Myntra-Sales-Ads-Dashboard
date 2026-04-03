export function renderListings(data) {

    const content = document.getElementById("content");

    content.innerHTML = `
        <div class="card">
            <input id="searchBox" placeholder="Search style ID..." />

            <table class="table">
                <thead>
                    <tr>
                        <th>Style</th>
                        <th>Brand</th>
                        <th>GMV</th>
                        <th>Units</th>
                        <th>Spend</th>
                        <th>Ad Revenue</th>
                        <th>ROI</th>
                    </tr>
                </thead>
                <tbody id="listingBody"></tbody>
            </table>
        </div>
    `;

    renderRows(data);

    document.getElementById("searchBox").oninput = (e) => {
        const val = e.target.value.toLowerCase();

        const filtered = data.filter(d =>
            d.style.toLowerCase().includes(val)
        );

        renderRows(filtered);
    };
}

function renderRows(data) {

    const rows = data.map(r => `
        <tr>
            <td>${r.style}</td>
            <td>${r.brand}</td>
            <td>${r.gmv.toFixed(0)}</td>
            <td>${r.units}</td>
            <td>${r.spend.toFixed(0)}</td>
            <td>${r.adRevenue.toFixed(0)}</td>
            <td>${(r.adRevenue / r.spend || 0).toFixed(2)}</td>
        </tr>
    `).join("");

    document.getElementById("listingBody").innerHTML = rows;
}