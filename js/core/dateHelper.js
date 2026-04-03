export function normalizeDate(value, format) {

    if (!value) return null;

    if (format === "YYYYMMDD") {
        return `${value.slice(0,4)}-${value.slice(4,6)}-${value.slice(6,8)}`;
    }

    if (format === "DD-MM-YYYY") {
        const [d,m,y] = value.split("-");
        return `${y}-${m}-${d}`;
    }

    return value;
}