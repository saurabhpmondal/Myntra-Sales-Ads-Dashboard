export function getFilterRange(type) {

    const today = new Date();

    if (type === "7d") {
        const past = new Date();
        past.setDate(today.getDate() - 7);

        return {
            start: past.toISOString().split("T")[0],
            end: today.toISOString().split("T")[0]
        };
    }

    if (type === "month") {
        const start = new Date(today.getFullYear(), today.getMonth(), 1);

        return {
            start: start.toISOString().split("T")[0],
            end: today.toISOString().split("T")[0]
        };
    }

    if (type === "lastMonth") {
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const end = new Date(today.getFullYear(), today.getMonth(), 0);

        return {
            start: start.toISOString().split("T")[0],
            end: end.toISOString().split("T")[0]
        };
    }

    return null;
}

export function applyDateFilter(data, range) {

    if (!range) return data;

    return data.filter(r => r.date >= range.start && r.date <= range.end);
}