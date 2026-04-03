import { COLUMN_MAPPING } from "./columnMapping.js";
import { DATA_REGISTRY } from "./dataRegistry.js";
import { normalizeDate } from "./dateHelper.js";

function toNumber(value) {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
}

// 🔥 SALES DATE FROM "date" COLUMN (DD-MM-YYYY)
function buildSalesDate(row) {

    const raw = row["date"];

    if (!raw) return null;

    const parts = String(raw).trim().split("-");

    if (parts.length !== 3) return null;

    const [dd, mm, yyyy] = parts;

    if (!dd || !mm || !yyyy) return null;

    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
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

        // 🔥 DATE HANDLING FIXED
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