import { buildAlerts } from "./engine.js";
import { renderAlerts } from "./ui.js";

export function runAlerts(){

    const data = buildAlerts();

    renderAlerts(data);
}