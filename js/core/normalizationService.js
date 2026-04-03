import { COLUMN_MAPPING } from "./columnMapping.js";
import { DATA_REGISTRY } from "./dataRegistry.js";
import { normalizeDate } from "./dateHelper.js";

function toNumber(value) {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
}

// 🔥 MONTH MAP (CLEAN + FIXED)
const MONTH_MAP = {
    JAN: "01",
    FEB: "02",
    MAR: "03",
    APR: "04",
    MAY: "05",
    JUN: "06",
    JUL: "07",
    AUG: "08",
    SEP: "09",
    OCT: "10",
    NOV: "11",
    DEC: "12"
};

// 🔥 FINAL SALES DATE BUILDER (NO SPLIT, NO CREATED ON)
function buildSalesDate(row) {

    const day = String(row["date"]).trim();
    const monthRaw = String(row["month"]).trim().toUpperCase();
    const year = String(row["year"]).trim();

    if (!day || !monthRaw || !year) return null;

    const month = MONTH_MAP[monthRaw];

    if (!month) return null;

    const d = day.padStart(2, "0");

    return `${year}-${month}-${d}`;
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

        // 🔥 DATE HANDLING (FINAL CORRECT)
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