import { loadInitialData } from "./core/dataLoader.js";
import { parseCSV } from "./core/dataParser.js";
import { normalizeDataset } from "./core/normalizationService.js";
import { setData } from "./core/stateManager.js";
import { loadModule } from "./router/appRouter.js";

import { renderSidebar } from "./ui/layout/sidebar.js";
import { renderHeader } from "./ui/layout/header.js";
import { renderFilters } from "./filters/ui.js";

async function init() {

    renderSidebar();
    renderHeader();
    renderFilters();

    const raw = await loadInitialData();

    for (let key in raw) {
        const parsed = parseCSV(raw[key]);
        const normalized = normalizeDataset(key, parsed);
        setData(key, normalized);
    }

    loadModule("dashboard");
}

init();