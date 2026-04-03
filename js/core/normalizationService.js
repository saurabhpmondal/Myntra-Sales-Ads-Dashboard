import { COLUMN_MAPPING } from "./columnMapping.js";
import { DATA_REGISTRY } from "./dataRegistry.js";
import { normalizeDate } from "./dateHelper.js";

export function normalizeDataset(name, data) {

    const mapping = COLUMN_MAPPING[name];
    const config = DATA_REGISTRY[name];

    return data.map(row => {

        const obj = {};

        for (let key in mapping) {
            obj[key] = Number(row[mapping[key]]) || row[mapping[key]];
        }

        obj.date = normalizeDate(row[config.dateField], config.dateFormat);

        return obj;
    });
}