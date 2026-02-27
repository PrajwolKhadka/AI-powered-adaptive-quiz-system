import { difficultyMap } from "../../utils/difficulty";

describe("difficultyMap", () => {
  test("VERY EASY maps to -2", () => {
    expect(difficultyMap["VERY EASY"]).toBe(-2);
  });

  test("EASY maps to -1", () => {
    expect(difficultyMap["EASY"]).toBe(-1);
  });

  test("MEDIUM maps to 0", () => {
    expect(difficultyMap["MEDIUM"]).toBe(0);
  });

  test("HARD maps to 1", () => {
    expect(difficultyMap["HARD"]).toBe(1);
  });

  test("VERY HARD maps to 2", () => {
    expect(difficultyMap["VERY HARD"]).toBe(2);
  });

  test("unknown difficulty returns undefined", () => {
    expect(difficultyMap["ULTRA HARD"]).toBeUndefined();
  });

  test("map has exactly 5 entries", () => {
    expect(Object.keys(difficultyMap).length).toBe(5);
  });

  test("values are ordered from lowest to highest", () => {
    const values = Object.values(difficultyMap);
    const sorted = [...values].sort((a, b) => a - b);
    expect(values).toEqual(sorted);
  });
});