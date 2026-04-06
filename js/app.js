import { loadAllData } from "./core/dataLoader.js";
import { buildRegistry } from "./core/dataRegistry.js";
import { initFilters } from "./filters/binder.js";
import { runDashboard } from "./modules/dashboard/binder.js";

import {
    startLoader,
    stopLoader,
    setStage
} from "./utils/loader.js";

async function initApp() {

    startLoader();
    setStage("Fetching");

    const raw = await loadAllData();

    setStage("Processing");

    const data = buildRegistry(raw);

    window.APP_DATA = data;

    setStage("Rendering");

    initFilters();
    runDashboard();

    setStage("Done");

    setTimeout(() => {
        stopLoader();
    }, 300);
}

initApp();