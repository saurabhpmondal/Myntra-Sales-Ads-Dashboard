import {
    updateFileProgress,
    nextFile,
    setStage
} from "../utils/loader.js";

export async function loadAllData() {

    const urls = {
        CDR: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGOsj66mo-CpS5eTerQgEcjYvr5GuOkQUIQ_9Sy4bwFu6FjGv9wBvCZn5UQBcFB7M-dcuJdbxMxSnj/pub?gid=1175680150&output=csv",
        CPR: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGOsj66mo-CpS5eTerQgEcjYvr5GuOkQUIQ_9Sy4bwFu6FjGv9wBvCZn5UQBcFB7M-dcuJdbxMxSnj/pub?gid=1490735065&output=csv",
        PPR: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGOsj66mo-CpS5eTerQgEcjYvr5GuOkQUIQ_9Sy4bwFu6FjGv9wBvCZn5UQBcFB7M-dcuJdbxMxSnj/pub?gid=1885382311&output=csv",
        SALES: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGOsj66mo-CpS5eTerQgEcjYvr5GuOkQUIQ_9Sy4bwFu6FjGv9wBvCZn5UQBcFB7M-dcuJdbxMxSnj/pub?gid=1679615114&output=csv",
        TRAFFIC: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGOsj66mo-CpS5eTerQgEcjYvr5GuOkQUIQ_9Sy4bwFu6FjGv9wBvCZn5UQBcFB7M-dcuJdbxMxSnj/pub?gid=533529379&output=csv"
    };

    const raw = {};

    for (const key in urls) {

        setStage("Fetching");
        updateFileProgress(key);

        const res = await fetch(urls[key]);
        const text = await res.text();

        // estimate rows (safe, no parser change)
        const rows = text.split("\n").length - 1;
        updateFileProgress(key, rows);

        raw[key] = text;

        nextFile();
    }

    return raw;
}