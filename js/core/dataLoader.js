import { DATA_REGISTRY } from "./dataRegistry.js";

async function fetchCSV(url) {
    const res = await fetch(url);
    return await res.text();
}

export async function loadInitialData() {

    const result = {};

    for (let key in DATA_REGISTRY) {
        result[key] = await fetchCSV(DATA_REGISTRY[key].url);
    }

    return result;
}