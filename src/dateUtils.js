export function getDateWithOffset(date, daysOffset) {
    const temp = new Date(date);
    return new Date(temp.setTime(temp.getTime() + daysOffset * dayMs));
}