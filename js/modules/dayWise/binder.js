import { buildDayWiseData } from "./engine.js";
import { renderDayWise } from "./ui.js";

export function runDayWise(){
    const data = buildDayWiseData();
    renderDayWise(data);
}