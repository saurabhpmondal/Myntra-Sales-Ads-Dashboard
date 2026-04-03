function buildSalesDate(row) {
    const day = Number(row["day"]);
    const month = Number(row["month"]);
    const year = Number(row["year"]);

    if (!day || !month || !year) return null;

    const d = String(day).padStart(2, "0");
    const m = String(month).padStart(2, "0");

    return `${year}-${m}-${d}`;
}