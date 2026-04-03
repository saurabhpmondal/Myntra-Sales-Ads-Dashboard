import { getData } from "../../core/stateManager.js";

export function buildTraffic() {

    const data = getData("TRAFFIC");

    let impressions = 0, clicks = 0, atc = 0, purchases = 0;

    data.forEach(r => {
        impressions += r.impressions;
        clicks += r.clicks;
        atc += r.add_to_carts;
        purchases += r.purchases;
    });

    return { impressions, clicks, atc, purchases };
}