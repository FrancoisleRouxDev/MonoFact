import { localDateKey } from "@/lib/date";

describe("localDateKey", () => {
    it("formats a date as YYYY-MM-DD", () => {
        expect(localDateKey(new Date(2026, 0, 5))).toBe("2026-01-05");
        expect(localDateKey(new Date(2026, 11, 31))).toBe("2026-12-31");
    });

    it("uses local time, not UTC", () => {
        // 23:30 local on 9 March is still 9 March, whatever the UTC offset.
        expect(localDateKey(new Date(2026, 2, 9, 23, 30))).toBe("2026-03-09");
        expect(localDateKey(new Date(2026, 2, 10, 0, 30))).toBe("2026-03-10");
    });

    it("defaults to today", () => {
        expect(localDateKey()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
});
