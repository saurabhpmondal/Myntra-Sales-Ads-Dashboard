export function renderTraffic(data) {

    const content = document.getElementById("content");

    content.innerHTML = `
        <div class="card">
            <h2>Traffic Funnel</h2>
            <p>Impressions: ${data.impressions}</p>
            <p>Clicks: ${data.clicks}</p>
            <p>ATC: ${data.atc}</p>
            <p>Purchases: ${data.purchases}</p>
        </div>
    `;
}