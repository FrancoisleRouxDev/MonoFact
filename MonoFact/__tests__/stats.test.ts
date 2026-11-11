import { calcStreakBonus, getLevelFromXP, getRequiredXPForLevel } from "@/app/services/stats";

// stats.ts imports the Firebase config; the pure helpers don't need it.
jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));
jest.mock("@/app/services/config", () => ({ auth: {}, db: {} }));
jest.mock("firebase/firestore", () => ({}));

describe("getLevelFromXP", () => {
    it("starts at level 1", () => {
        expect(getLevelFromXP(0)).toBe(1);
        expect(getLevelFromXP(359)).toBe(1);
    });

    it("levels up at the 200 * 1.8^(n-1) thresholds", () => {
        expect(getLevelFromXP(360)).toBe(2);
        expect(getLevelFromXP(647)).toBe(2);
        expect(getLevelFromXP(648)).toBe(3);
    });

    it("agrees with getRequiredXPForLevel", () => {
        for (let level = 1; level < 8; level++) {
            const needed = getRequiredXPForLevel(level);
            expect(getLevelFromXP(needed - 1)).toBe(level);
            expect(getLevelFromXP(needed)).toBe(level + 1);
        }
    });
});

describe("calcStreakBonus", () => {
    it("gives nothing below a streak of 3", () => {
        expect(calcStreakBonus(0)).toBe(0);
        expect(calcStreakBonus(2)).toBe(0);
    });

    it("gives 10 per streak step from 3", () => {
        expect(calcStreakBonus(3)).toBe(30);
        expect(calcStreakBonus(5)).toBe(50);
    });

    it("caps at a streak of 9", () => {
        expect(calcStreakBonus(9)).toBe(90);
        expect(calcStreakBonus(40)).toBe(90);
    });
});
