let index = 0;
const PAGE = 50;

export function renderTraffic(data){

    const container = document.getElementById("reportContainer");

    const period = data.period || {};

    container.innerHTML = `
        <div class="card table-card">
            <h3>Traffic Funnel</h3>

            <div style="margin-bottom:10px;font-size:12px;color:#6b7280">
                Period: ${period.start || "-"} → ${period.end || "-"}
            </div>

            <div class="table-wrapper" id="trafficWrapper">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Style</th>
                            <th>Brand</th>
                            <th>Impressions</th>
                            <th>Clicks</th>
                            <th>ATC</th>
                            <th>Orders</th>
                            <th>CTR</th>
                            <th>CVR</th>
                        </tr>
                    </thead>
                    <tbody id="trafficBody"></tbody>
                </table>
            </div>
        </div>
    `;

    index = 0;
    load(data.rows);

    document.getElementById("trafficWrapper").onscroll = function(){
        const el = this;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10){
            load(data.rows);
        }
    };
}

function load(data){

    const body = document.getElementById("trafficBody");

    const slice = data.slice(index, index + PAGE);

    const rows = slice.map(([k,r])=>`
        <tr>
            <td>${k}</td>
            <td>${r.brand}</td>
            <td>${fmt(r.impressions)}</td>
            <td>${fmt(r.clicks)}</td>
            <td>${fmt(r.atc)}</td>
            <td>${fmt(r.orders)}</td>
            <td>${pct(r.ctr)}</td>
            <td>${pct(r.cvr)}</td>
        </tr>
    `).join("");

    body.insertAdjacentHTML("beforeend", rows);

    index += PAGE;
}

function fmt(n){ return Number(n||0).toLocaleString(); }
function pct(n){ return ((n||0)*100).toFixed(2)+"%"; }