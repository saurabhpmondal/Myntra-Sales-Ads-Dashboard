import { buildDashboard } from "./engine.js";
import { renderDashboard } from "./ui.js";

export function run() {

    try {

        const data = buildDashboard();

        renderDashboard(data);

    } catch (e) {

        console.error("Dashboard error:", e);

        document.getElementById("content").innerHTML =
            "<p>Error loading dashboard</p>";
    }
}