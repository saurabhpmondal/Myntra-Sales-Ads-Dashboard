import { buildDashboard } from "./engine.js";
import { renderDashboard } from "./ui.js";

export function runDashboard() {

    const data = buildDashboard(window.APP_DATA);

    renderDashboard(data);
}