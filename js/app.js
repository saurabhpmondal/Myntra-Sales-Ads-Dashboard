import { loadAllData } from "./core/dataLoader.js";
import { initFilters } from "./filters/binder.js";
import { runDashboard } from "./modules/dashboard/binder.js";

async function initApp() {

    const data = await loadAllData();

    // global state (simple for now)
    window.APP_DATA = data;

    // init filters
    initFilters();

    // load dashboard
    runDashboard();
}

initApp();