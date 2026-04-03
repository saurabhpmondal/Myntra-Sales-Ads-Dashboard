export function renderSidebar() {

    const el = document.getElementById("sidebar");

    el.innerHTML = `
        <h2>Dashboard</h2>

        <div data-module="dashboard">Dashboard</div>
        <div data-module="campaign">Campaign</div>
        <div data-module="placement">Placement</div>
        <div data-module="product">Daily Ads</div>
        <div data-module="listings">Listings</div>
        <div data-module="salesTrend">Traffic</div>
        <div data-module="alerts">Alerts</div>
    `;

    el.querySelectorAll("[data-module]").forEach(item => {
        item.onclick = async () => {
            const { loadModule } = await import("../../router/appRouter.js");
            loadModule(item.dataset.module);
        };
    });
}