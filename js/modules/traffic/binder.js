import { buildTrafficData } from "./engine.js";
import { renderTraffic } from "./ui.js";

export function runTraffic(){

    const data = buildTrafficData();

    renderTraffic(data);
}