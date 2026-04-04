import { renderLineChart } from "../../ui/components/charts/lineChart.js";

let chartRef = null; // 🔥 track chart instance

export function renderDailyAds(map) {

    const container = document.getElementById("reportContainer");

    container.innerHTML = `
        <div class="daily-ads">

            <!-- SELECTORS -->
            <div class="dual-select">
                <select id="metricA">${options("spend")}</select>
                <span>vs</span>
                <select id="metricB">${options("total_rev")}</select>
            </div>

            <!-- CHART -->
            <div class="card">
                <canvas id="dailyAdsChart"></canvas>
            </div>

            <!-- TABLE -->
            <div class="card table-wrapper">
                ${table(map)}
            </div>

        </div>
    `;

    // Initial render
    updateChart(map);

    // Events
    document.getElementById("metricA").onchange = () => updateChart(map);
    document.getElementById("metricB").onchange = () => updateChart(map);
}

/* ---------- OPTIONS ---------- */

function options(selected) {

    const list = [
        "spend","impressions","clicks","ctr",
        "cvr","cpc","total_units","total_rev","roi_total"
    ];

    return list.map(m => `
        <option value="${m}" ${m===selected?"selected":""}>
            ${m.toUpperCase()}
        </option>
    `).join("");
}

/* ---------- CHART FIX ---------- */

function updateChart(map) {

    const A = document.getElementById("metricA").value;
    const B = document.getElementById("metricB").value;

    const labels = Object.keys(map).sort();

    const dataA = labels.map(d => map[d][A] || 0);
    const dataB = labels.map(d => map[d][B] || 0);

    // 🔥 DESTROY OLD CHART (important)
    if (chartRef && chartRef.destroy) {
        chartRef.destroy();
    }

    chartRef = renderLineChart(
        "dailyAdsChart",
        labels,
        dataA,
        dataB,
        A,
        B
    );
}

/* ---------- TABLE ---------- */

function table(map) {

    const rows = Object.entries(map).sort().map(([d,r]) => `
        <tr>
            <td>${d}</td>

            <td>${fmt(r.spend)}</td>
            <td>${fmt(r.impressions)}</td>
            <td>${fmt(r.clicks)}</td>
            <td>${pct(r.ctr)}</td>
            <td>${pct(r.cvr)}</td>
            <td>${fmt2(r.cpc)}</td>

            <td>${fmt(r.direct_units)}</td>
            <td>${fmt(r.indirect_units)}</td>
            <td>${fmt(r.total_units)}</td>

            <td>${fmt(r.direct_rev)}</td>
            <td>${fmt(r.indirect_rev)}</td>
            <td>${fmt(r.total_rev)}</td>

            <td>${fmt2(r.roi_direct)}</td>
            <td>${fmt2(r.roi_indirect)}</td>
            <td>${fmt2(r.roi_total)}</td>
        </tr>
    `).join("");

    return `
        <table class="table">
            <thead>
                <tr>
                    <th>Date</th>

                    <th>Spend</th>
                    <th>Imp</th>
                    <th>Clicks</th>
                    <th>CTR</th>
                    <th>CVR</th>
                    <th>CPC</th>

                    <th>D Units</th>
                    <th>I Units</th>
                    <th>Total</th>

                    <th>D Rev</th>
                    <th>I Rev</th>
                    <th>Total</th>

                    <th>D ROI</th>
                    <th>I ROI</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

/* ---------- FORMAT ---------- */

function fmt(n){ return Number(n||0).toLocaleString(); }
function fmt2(n){ return Number(n||0).toFixed(2); }
function pct(n){ return ((n||0)*100).toFixed(2)+"%"; }