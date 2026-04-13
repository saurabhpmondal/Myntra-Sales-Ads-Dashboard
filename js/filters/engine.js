export function applyDateFilter(data, filter) {

    if (!filter || !filter.start || !filter.end) return data;

    const start = new Date(filter.start + "T00:00:00");
    const end   = new Date(filter.end   + "T23:59:59");

    return data.filter(r => {

        if (!r.date) return false;

        const d = new Date(r.date + "T12:00:00");

        return d >= start && d <= end;
    });
}

export function getFilterRange(type) {

    // 🔥 USE YESTERDAY AS LAST DATA DATE
    const today = new Date();
    today.setDate(today.getDate() - 1);

    if (type === "7d") {

        const start = new Date(today);
        start.setDate(today.getDate() - 6);

        return {
            start: format(start),
            end: format(today)
        };
    }

    if (type === "month") {

        const start = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        return {
            start: format(start),
            end: format(today)
        };
    }

    if (type === "lastMonth") {

        const start = new Date(
            today.getFullYear(),
            today.getMonth() - 1,
            1
        );

        const end = new Date(
            today.getFullYear(),
            today.getMonth(),
            0
        );

        return {
            start: format(start),
            end: format(end)
        };
    }

    return null;
}

/* 🔥 LOCAL DATE FORMAT (NO UTC SHIFT) */
function format(d) {

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${y}-${m}-${day}`;
}