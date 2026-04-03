export function renderCampaign(data) {

    const content = document.getElementById("content");

    const rows = Object.entries(data).map(([name, v]) => `
        <tr>
            <td>${name}</td>
            <td>${v.impressions}</td>
            <td>${v.clicks}</td>
            <td>${(v.clicks / v.impressions * 100 || 0).toFixed(2)}%</td>
            <td>${v.units}</td>
            <td>${v.revenue.toFixed(0)}</td>
            <td>${v.spend.toFixed(0)}</td>
            <td>${(v.revenue / v.spend || 0).toFixed(2)}</td>
        </tr>
    `).join("");

    content.innerHTML = `
        <div class="card">
            <h2>Campaign Performance</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Campaign</th>
                        <th>Impressions</th>
                        <th>Clicks</th>
                        <th>CTR</th>
                        <th>Units</th>
                        <th>Revenue</th>
                        <th>Spend</th>
                        <th>ROI</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}