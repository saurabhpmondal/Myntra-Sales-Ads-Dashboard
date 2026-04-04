let currentIndex = 0;
const PAGE_SIZE = 50;

export function renderListings(data){

    const container = document.getElementById("reportContainer");

    container.innerHTML = `
        <div class="card table-card">
            <h3>Listings Performance</h3>

            <div class="table-wrapper" id="listTableWrapper">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Style</th>
                            <th>Brand</th>
                            <th>GMV</th>
                            <th>Units</th>
                            <th>Spend</th>
                            <th>Revenue</th>
                            <th>ROI</th>
                            <th>Imp</th>
                            <th>Clicks</th>
                        </tr>
                    </thead>
                    <tbody id="listBody"></tbody>
                </table>
            </div>
        </div>
    `;

    currentIndex = 0;
    loadMore(data);

    document.getElementById("listTableWrapper").onscroll = function(){
        const el = this;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10){
            loadMore(data);
        }
    };
}

/* ---------- LOAD MORE ---------- */

function loadMore(data){

    const body = document.getElementById("listBody");

    const slice = data.slice(currentIndex, currentIndex + PAGE_SIZE);

    const rows = slice.map(([k,r])=>`
        <tr>
            <td>${k}</td>
            <td>${r.brand}</td>
            <td>${fmt(r.gmv)}</td>
            <td>${fmt(r.units)}</td>
            <td>${fmt(r.spend)}</td>
            <td>${fmt(r.revenue)}</td>
            <td>${fmt2(r.roi)}</td>
            <td>${fmt(r.impressions)}</td>
            <td>${fmt(r.clicks)}</td>
        </tr>
    `).join("");

    body.insertAdjacentHTML("beforeend", rows);

    currentIndex += PAGE_SIZE;
}

/* ---------- FORMAT ---------- */

function fmt(n){ return Number(n||0).toLocaleString(); }
function fmt2(n){ return Number(n||0).toFixed(2); }