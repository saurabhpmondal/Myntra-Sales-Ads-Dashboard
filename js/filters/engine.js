export function applyDateFilter(data, filter) {

    if (!filter || !filter.start || !filter.end) return data;

    const start = new Date(filter.start);
    const end = new Date(filter.end);

    return data.filter(r => {

        if (!r.date) return false;

        const d = new Date(r.date);

        return d >= start && d <= end;
    });
}

export function getFilterRange(type) {

    const today = new Date();

    if (type === "7d") {
        const start = new Date();
        start.setDate(today.getDate() - 7);

        return {
            start: format(start),
            end: format(today)
        };
    }

    if (type === "month") {
        const start = new Date(today.getFullYear(), today.getMonth(), 1);

        return {
            start: format(start),
            end: format(today)
        };
    }

    if (type === "lastMonth") {
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const end = new Date(today.getFullYear(), today.getMonth(), 0);

        return {
            start: format(start),
            end: format(end)
        };
    }
}

function format(d) {
    return d.toISOString().split("T")[0];
}