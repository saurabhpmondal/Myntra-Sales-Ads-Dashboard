import { getData } from "../../core/stateManager.js";

export function buildAlerts() {

    const ads = getData("CDR");

    const alerts = [];

    ads.forEach(r => {

        if (r.spend > 1000 && r.units === 0) {
            alerts.push(`Spend wasted on campaign ${r.campaign_name}`);
        }

        if (r.revenue / r.spend < 1) {
            alerts.push(`Low ROI campaign ${r.campaign_name}`);
        }

    });

    return alerts;
}