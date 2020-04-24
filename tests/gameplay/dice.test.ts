import { Dice } from "../../src/gameplay/dice";

describe("Dice", () => {
  test("throw works", () => {
    const dice = new Dice();
    const result = dice.throw();

    expect(result).toHaveLength(2);
    expect(result[0]).toBeGreaterThan(0);
    expect(result[1]).toBeGreaterThan(0);
  });
});
