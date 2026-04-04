import { buildCampaignData } from "./engine.js";
import { renderCampaign } from "./ui.js";

export function runCampaign(){

    const data = buildCampaignData();

    renderCampaign(data);
}