import { buildDailyAdsData } from "./engine.js";
import { renderDailyAds } from "./ui.js";

export function runDailyAds() {

    const data = buildDailyAdsData();

    renderDailyAds(data);
}