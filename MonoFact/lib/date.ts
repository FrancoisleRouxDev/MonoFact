// "YYYY-MM-DD" in the device's local time, so "today" rolls over at local
// midnight instead of UTC midnight.
export function localDateKey(d: Date = new Date()): string {
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
}
