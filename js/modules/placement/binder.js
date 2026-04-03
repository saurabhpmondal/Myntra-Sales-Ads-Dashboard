import { buildPlacementReport } from "./engine.js";
import { renderPlacement } from "./ui.js";

export function run() {
    const data = buildPlacementReport();
    renderPlacement(data);
}