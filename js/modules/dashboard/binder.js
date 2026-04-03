import { buildDashboard } from "./engine.js";
import { renderDashboard } from "./ui.js";

export function run() {
    const data = buildDashboard();
    renderDashboard(data);
}