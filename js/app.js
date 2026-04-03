import { loadInitialData } from "./core/dataLoader.js";
import { parseCSV } from "./core/dataParser.js";
import { normalizeDataset } from "./core/normalizationService.js";
import { setData } from "./core/stateManager.js";
import { loadModule } from "./router/appRouter.js";

async function init() {

    const raw = await loadInitialData();

    for (let key in raw) {
        const parsed = parseCSV(raw[key]);
        const normalized = normalizeDataset(key, parsed);
        setData(key, normalized);
    }

    loadModule("dashboard");
}

init();