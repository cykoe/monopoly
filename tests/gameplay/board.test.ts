import { Board } from "../../src/gameplay/board";

describe("Board", () => {
  let board: Board;

  beforeEach(() => {
    board = new Board({});
  });

  test("createSpaces()", () => {
    expect(true).toEqual(true);
  });
});
