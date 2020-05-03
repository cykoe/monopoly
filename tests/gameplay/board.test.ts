import { Board } from "../../src/gameplay/board";
import {SpaceType} from "../../src/gameplay/shared/interfaces";

describe("Board", () => {
  let board: Board;

  beforeEach(() => {
    board = new Board({});
  });

  test("created Ok", () => {
    // There are a total of 40 spaces on the board
    expect(board.spaces.length).toEqual(40);
    expect(board.spaces[1].type).toEqual(SpaceType.Street);
    expect(board.spaces[12].type).toEqual(SpaceType.Utility);
    expect(board.spaces[15].type).toEqual(SpaceType.Rail);
    expect(board.spaces[2].type).toEqual(SpaceType.Community);
    expect(board.spaces[7].type).toEqual(SpaceType.Chance);
    expect(board.spaces[4].type).toEqual(SpaceType.Tax);
    expect(board.spaces[30].type).toEqual(SpaceType.ToJail);
    expect(board.spaces[10].type).toEqual(SpaceType.Jail);
    expect(board.spaces[20].type).toEqual(SpaceType.Parking);
    expect(board.spaces[0].type).toEqual(SpaceType.Go);
  });
});
