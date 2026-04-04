import { buildPlacementData } from "./engine.js";
import { renderPlacement } from "./ui.js";

export function runPlacement(){

    const data = buildPlacementData();

    renderPlacement(data);
}