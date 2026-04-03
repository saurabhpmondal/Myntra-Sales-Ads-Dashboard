import { getData } from "../../core/stateManager.js";

export function buildAlerts() {

    const ads = getData("CDR");

    const alerts = [];

    ads.forEach(r => {

        if (r.spend > 1000 && r.units === 0) {
            alerts.push({
                type: "danger",
                msg: `High spend but no sales → ${r.campaign_name}`
            });
        }

        if (r.revenue / r.spend < 1) {
            alerts.push({
                type: "warning",
                msg: `Low ROI campaign → ${r.campaign_name}`
            });
        }

    });

    return alerts.slice(0, 50);
}