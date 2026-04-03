import { getFilterRange } from "./engine.js";
import { setFilter } from "../core/stateManager.js";
import { loadModule } from "../router/appRouter.js";

export function initFilters() {

    document.querySelectorAll("[data-type]").forEach(btn => {

        btn.onclick = () => {

            const type = btn.dataset.type;
            const range = getFilterRange(type);

            setFilter(range);

            loadModule("dashboard");
        };
    });
}