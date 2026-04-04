export function parseCSV(text) {

    const rows = text.trim().split("\n").map(r => r.split(","));

    const headers = rows[0].map(h =>
        h.trim().toLowerCase().replace(/\r/g, "")
    );

    return rows.slice(1).map(row => {

        const obj = {};

        headers.forEach((h, i) => {
            obj[h] = (row[i] || "").trim();
        });

        return obj;
    });
}