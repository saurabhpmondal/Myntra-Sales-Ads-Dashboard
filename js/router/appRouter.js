const routes = {
    dashboard: () => import("../modules/dashboard/index.js"),
    campaign: () => import("../modules/ads/campaign/index.js"),
    placement: () => import("../modules/ads/placement/index.js"),
    product: () => import("../modules/ads/product/index.js"),
    listings: () => import("../modules/listings/index.js"),
    salesTrend: () => import("../modules/traffic/index.js"),
    alerts: () => import("../modules/alerts/index.js")
};

export async function loadModule(name, targetId = "content") {

    const moduleLoader = routes[name];

    if (!moduleLoader) {
        console.error("Module not found:", name);
        return;
    }

    const module = await moduleLoader();

    // IMPORTANT: pass target container
    const target = document.getElementById(targetId);

    if (!target) {
        console.error("Target container not found:", targetId);
        return;
    }

    // Clear only target
    target.innerHTML = "";

    if (typeof module.run === "function") {
        module.run(target);
    } else {
        console.error("Module has no run() method:", name);
    }
}