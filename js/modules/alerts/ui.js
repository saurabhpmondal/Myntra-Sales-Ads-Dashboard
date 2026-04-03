export function renderAlerts(alerts) {

    const content = document.getElementById("content");

    content.innerHTML = `
        <div class="card">
            <h2>Alerts</h2>
            ${alerts.map(a => `<p>${a}</p>`).join("")}
        </div>
    `;
}