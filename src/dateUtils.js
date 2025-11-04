const dayMs = 1000*60*60*24;

export function getDateWithOffset(date, daysOffset) {
    const temp = new Date(date);
    return new Date(temp.setTime(temp.getTime() + daysOffset * dayMs));
}

export function daysBetween(a, b) {
    const ms = b - a;
    return ms / dayMs;
}