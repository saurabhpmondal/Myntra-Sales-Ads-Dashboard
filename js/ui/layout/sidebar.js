export function renderSidebar() {

    const el = document.getElementById("sidebar");

    el.innerHTML = `
        <h2 style="margin-bottom:20px;">Dashboard</h2>

        <div class="nav">
            <div data-module="dashboard">Dashboard</div>
            <div data-module="campaign">Campaign</div>
            <div data-module="product">Product</div>
            <div data-module="placement">Placement</div>
            <div data-module="listings">Listings</div>
        </div>
    `;

    el.querySelectorAll("[data-module]").forEach(item => {
        item.onclick = async () => {
            const { loadModule } = await import("../../router/appRouter.js");
            loadModule(item.dataset.module);
        };
    });
}