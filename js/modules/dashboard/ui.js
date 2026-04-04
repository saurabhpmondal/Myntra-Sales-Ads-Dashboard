export function renderDashboard(data) {

    const content = document.getElementById("content");

    content.innerHTML = `
        <div class="kpi-grid">
            <div class="card kpi-card"><h3>GMV</h3><p>0</p></div>
            <div class="card kpi-card"><h3>Units</h3><p>0</p></div>
            <div class="card kpi-card"><h3>ASP</h3><p>0</p></div>
            <div class="card kpi-card"><h3>Spend</h3><p>0</p></div>
        </div>

        <div class="card">
            Dashboard initialized successfully
        </div>
    `;
}