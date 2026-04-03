import { buildDailyAds } from "./engine.js";
import { renderDailyAds } from "./ui.js";

export function run() {
    const data = buildDailyAds();
    renderDailyAds(data);
}