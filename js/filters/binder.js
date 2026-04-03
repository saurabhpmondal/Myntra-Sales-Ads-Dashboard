import { getFilterRange } from "./engine.js";
import { setFilter } from "../core/stateManager.js";
import { loadModule } from "../router/appRouter.js";

export function initFilters() {

    // quick buttons
    document.querySelectorAll("[data-type]").forEach(btn => {

        btn.onclick = () => {
            const type = btn.dataset.type;
            const range = getFilterRange(type);

            setFilter(range);
            loadModule("dashboard");
        };
    });

    // custom range
    document.getElementById("applyCustom").onclick = () => {

        const start = document.getElementById("startDate").value;
        const end = document.getElementById("endDate").value;

        if (!start || !end) return;

        setFilter({ start, end });
        loadModule("dashboard");
    };
}