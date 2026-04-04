import { loadAllData } from "./core/dataLoader.js";
import { buildRegistry } from "./core/dataRegistry.js";
import { initFilters } from "./filters/binder.js";
import { runDashboard } from "./modules/dashboard/binder.js";

async function initApp() {

    const raw = await loadAllData();

    const data = buildRegistry(raw);

    window.APP_DATA = data;

    initFilters();

    runDashboard();
}

initApp();