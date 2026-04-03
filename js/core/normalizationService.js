import { COLUMN_MAPPING } from "./columnMapping.js";
import { DATA_REGISTRY } from "./dataRegistry.js";
import { normalizeDate } from "./dateHelper.js";

function toNumber(value) {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
}

export function normalizeDataset(name, data) {

    const mapping = COLUMN_MAPPING[name];
    const config = DATA_REGISTRY[name];

    return data.map(row => {

        const obj = {};

        for (let key in mapping) {

            const raw = row[mapping[key]];

            // Force numeric for known metrics
            if (
                key === "impressions" ||
                key === "clicks" ||
                key === "spend" ||
                key === "revenue" ||
                key === "units"
            ) {
                obj[key] = toNumber(raw);
            } else {
                obj[key] = raw;
            }
        }

        obj.date = normalizeDate(row[config.dateField], config.dateFormat);

        return obj;
    });
}