export function parseCSV(text) {

    const rows = text.trim().split("\n");
    const headers = rows[0].split(",");

    return rows.slice(1).map(row => {
        const values = row.split(",");
        const obj = {};

        headers.forEach((h, i) => {
            obj[h.trim()] = values[i]?.trim();
        });

        return obj;
    });
}