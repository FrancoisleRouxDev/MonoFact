import { shuffle } from "@/lib/shuffle";

describe("shuffle", () => {
    it("returns the same items", () => {
        const input = Array.from({ length: 50 }, (_, i) => i);
        expect([...shuffle(input)].sort((a, b) => a - b)).toEqual(input);
    });

    it("does not mutate the input", () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8];
        const copy = [...input];
        const result = shuffle(input);
        expect(input).toEqual(copy);
        expect(result).not.toBe(input);
    });

    it("handles empty and single-item arrays", () => {
        expect(shuffle([])).toEqual([]);
        expect(shuffle([1])).toEqual([1]);
    });
});
