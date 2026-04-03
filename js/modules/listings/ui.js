let fullData = [];
let visible = 50;

export function renderListings(data) {

    fullData = data;
    visible = 50;

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

            <button id="loadMore">Load More</button>

        </div>
    `;

    renderRows();

    document.getElementById("loadMore").onclick = () => {
        visible += 50;
        renderRows();
    };

    document.getElementById("searchBox").oninput = (e) => {
        const val = e.target.value.toLowerCase();
        fullData = data.filter(d => d.style.includes(val));
        visible = 50;
        renderRows();
    };
}

function renderRows() {

    const rows = fullData.slice(0, visible).map(r => `
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