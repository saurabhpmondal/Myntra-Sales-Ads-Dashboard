import { buildCampaignReport } from "./engine.js";
import { renderCampaign } from "./ui.js";

export function run() {
    const data = buildCampaignReport();
    renderCampaign(data);
}