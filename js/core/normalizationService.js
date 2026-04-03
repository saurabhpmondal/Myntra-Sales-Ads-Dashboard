import { COLUMN_MAPPING } from "./columnMapping.js";
import { DATA_REGISTRY } from "./dataRegistry.js";
import { normalizeDate } from "./dateHelper.js";

function toNumber(value) {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
}

// 🔥 STRICT SALES DATE BUILDER
function buildSalesDate(row) {

    const day = Number(row["day"]);
    const month = Number(row["month"]);
    const year = Number(row["year"]);

    // ❗ reject invalid rows
    if (!day || !month || !year) return null;

    const d = String(day).padStart(2, "0");
    const m = String(month).padStart(2, "0");

    return `${year}-${m}-${d}`;
}

export function normalizeDataset(name, data) {

    const mapping = COLUMN_MAPPING[name];
    const config = DATA_REGISTRY[name];

    return data.map(row => {

        const obj = {};

        for (let key in mapping) {

            const raw = row[mapping[key]];

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

        // 🔥 DATE HANDLING
        if (name === "SALES") {
            obj.date = buildSalesDate(row);
        } else {
            obj.date = normalizeDate(
                row[config.dateField],
                config.dateFormat
            );
        }

        return obj;
    });
}