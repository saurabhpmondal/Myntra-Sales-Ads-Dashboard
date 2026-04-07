import { buildStyleIntelligence } from "./engine.js";
import { renderStyleIntelligence } from "./ui.js";

export function openStyleIntelligence(styleId){

    const data = buildStyleIntelligence(styleId);

    renderStyleIntelligence(data);
}