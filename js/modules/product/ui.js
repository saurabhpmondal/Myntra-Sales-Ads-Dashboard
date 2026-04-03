export function renderDailyAds(data) {

    const content = document.getElementById("content");

    const rows = Object.entries(data).map(([date, v]) => `
        <tr>
            <td>${date}</td>
            <td>${v.spend.toFixed(0)}</td>
            <td>${v.revenue.toFixed(0)}</td>
            <td>${v.clicks}</td>
        </tr>
    `).join("");

    content.innerHTML = `
        <div class="card">
            <h2>Daily Ads</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Spend</th>
                        <th>Revenue</th>
                        <th>Clicks</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}