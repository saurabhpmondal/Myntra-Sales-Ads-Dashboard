let index = 0;
const PAGE = 30;

export function renderAlerts(data){

    const container = document.getElementById("reportContainer");

    container.innerHTML = `
        <div class="card table-card">

            <h3>Smart Alerts</h3>

            <!-- FILTERS -->
            <div class="alert-filters">
                <select id="severityFilter">
                    <option value="ALL">All Severity</option>
                    <option value="HIGH">Critical</option>
                    <option value="MEDIUM">Warning</option>
                    <option value="LOW">Opportunity</option>
                </select>

                <select id="reportFilter">
                    <option value="ALL">All Reports</option>
                    <option value="Campaign">Campaign</option>
                </select>
            </div>

            <div class="table-wrapper" id="alertWrapper">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Entity</th>
                            <th>Issue</th>
                            <th>Value</th>
                            <th>Action</th>
                            <th>Severity</th>
                        </tr>
                    </thead>
                    <tbody id="alertBody"></tbody>
                </table>
            </div>

        </div>
    `;

    let filtered = data;

    document.getElementById("severityFilter").onchange = apply;
    document.getElementById("reportFilter").onchange = apply;

    function apply(){

        const s = document.getElementById("severityFilter").value;
        const r = document.getElementById("reportFilter").value;

        filtered = data.filter(a=>{
            if (s !== "ALL" && a.severity !== s) return false;
            if (r !== "ALL" && a.report !== r) return false;
            return true;
        });

        index = 0;
        document.getElementById("alertBody").innerHTML = "";
        load(filtered);
    }

    load(filtered);

    document.getElementById("alertWrapper").onscroll = function(){
        const el = this;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10){
            load(filtered);
        }
    };
}

/* ---------- LOAD ---------- */

function load(data){

    const body = document.getElementById("alertBody");

    const slice = data.slice(index, index + PAGE);

    const rows = slice.map(a=>`
        <tr>
            <td>${a.type}</td>
            <td>${a.entity}</td>
            <td>${a.issue}</td>
            <td>${fmt(a.value)}</td>
            <td>${a.action}</td>
            <td>${badge(a.severity)}</td>
        </tr>
    `).join("");

    body.insertAdjacentHTML("beforeend", rows);

    index += PAGE;
}

/* ---------- HELPERS ---------- */

function fmt(n){
    return typeof n === "number" ? n.toFixed(2) : n;
}

function badge(s){
    if (s==="HIGH") return "🔴";
    if (s==="MEDIUM") return "🟡";
    return "🟢";
}