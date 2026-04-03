import { buildAlerts } from "./engine.js";
import { renderAlerts } from "./ui.js";

export function run() {
    const data = buildAlerts();
    renderAlerts(data);
}