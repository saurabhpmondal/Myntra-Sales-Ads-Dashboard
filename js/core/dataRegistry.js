import { parseCSV } from "./dataParser.js";
import { normalizeData } from "./normalizationService.js";

let STORE = {};

export function buildRegistry(rawData) {

    const result = {};

    for (const key in rawData) {

        const parsed = parseCSV(rawData[key]);
        const normalized = normalizeData(key, parsed);

        result[key] = normalized;
    }

    STORE = result;

    return result;
}

export function getData(key) {
    return STORE[key] || [];
}