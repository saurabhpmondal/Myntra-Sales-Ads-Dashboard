export async function loadAllData() {

    const urls = {
        CDR: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGOsj66mo-CpS5eTerQgEcjYvr5GuOkQUIQ_9Sy4bwFu6FjGv9wBvCZn5UQBcFB7M-dcuJdbxMxSnj/pub?gid=1175680150&output=csv",
        CPR: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGOsj66mo-CpS5eTerQgEcjYvr5GuOkQUIQ_9Sy4bwFu6FjGv9wBvCZn5UQBcFB7M-dcuJdbxMxSnj/pub?gid=1490735065&output=csv",
        PPR: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGOsj66mo-CpS5eTerQgEcjYvr5GuOkQUIQ_9Sy4bwFu6FjGv9wBvCZn5UQBcFB7M-dcuJdbxMxSnj/pub?gid=1885382311&output=csv",
        SALES: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGOsj66mo-CpS5eTerQgEcjYvr5GuOkQUIQ_9Sy4bwFu6FjGv9wBvCZn5UQBcFB7M-dcuJdbxMxSnj/pub?gid=1679615114&output=csv",
        TRAFFIC: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGOsj66mo-CpS5eTerQgEcjYvr5GuOkQUIQ_9Sy4bwFu6FjGv9wBvCZn5UQBcFB7M-dcuJdbxMxSnj/pub?gid=533529379&output=csv"
    };

    const result = {};

    for (const key in urls) {
        const res = await fetch(urls[key]);
        const text = await res.text();
        result[key] = parseCSV(text);
    }

    return result;
}

function parseCSV(text) {

    const rows = text.split("\n").map(r => r.split(","));
    const headers = rows[0];

    return rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((h, i) => {
            obj[h.trim()] = row[i];
        });
        return obj;
    });
}