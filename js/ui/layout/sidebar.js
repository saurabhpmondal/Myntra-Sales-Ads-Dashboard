import { loadModule } from "../../router/appRouter.js";

export function renderSidebar() {

    const el = document.getElementById("sidebar");

    el.innerHTML = `
        <h2>Myntra Analytics</h2>

        <div class="nav-item active" data-module="dashboard">📊 Dashboard</div>
        <div class="nav-item" data-module="campaign">📈 Campaign</div>
        <div class="nav-item" data-module="placement">📍 Placement</div>
        <div class="nav-item" data-module="product">📅 Daily Ads</div>
        <div class="nav-item" data-module="listings">📦 Listings</div>
        <div class="nav-item" data-module="salesTrend">🌐 Traffic</div>
        <div class="nav-item" data-module="alerts">⚠️ Alerts</div>
    `;

    const items = el.querySelectorAll(".nav-item");

    items.forEach(item => {

        item.onclick = () => {

            items.forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            loadModule(item.dataset.module);
        };
    });
}