import { buildTopStylesData } from "./engine.js";
import { renderTopStyles } from "./ui.js";

export function runTopStyles(){

    const data = buildTopStylesData();

    renderTopStyles(data);
}