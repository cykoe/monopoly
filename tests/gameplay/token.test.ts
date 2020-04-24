import { IToken } from "../../src/gameplay/shared/interfaces";
import { Token } from "../../src/gameplay/token";

describe("Token", () => {
  let token: IToken;
  beforeAll(() => {
    token = new Token({ name: "ship" });
  });

  test("move works", () => {
    const result = token.move(1);

    expect(token.currentPosition).toEqual(1);
    expect(result).toBeFalsy();
  });

  test("move works (pass go)", () => {
    const result = token.move(50);

    expect(result).toBeTruthy();
  });
});
