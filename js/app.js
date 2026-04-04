import { loadAllData } from "./core/dataLoader.js";
import { renderFilters } from "./ui/filters.js";
import { runDashboard } from "./modules/dashboard/binder.js";

async function initApp() {

    const rawData = await loadAllData();

    window.APP_DATA = rawData;

    renderFilters();

    runDashboard();

}

initApp();