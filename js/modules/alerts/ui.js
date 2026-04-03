export function renderAlerts(alerts) {

    const content = document.getElementById("content");

    content.innerHTML = `
        <div class="card">
            <h3>Alerts</h3>

            ${alerts.map(a => `
                <div class="alert ${a.type}">
                    ${a.msg}
                </div>
            `).join("")}
        </div>
    `;
}