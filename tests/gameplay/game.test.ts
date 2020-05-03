import { Game, IPrePlayer, ISnapshot } from "../../src/gameplay/game";
import { StreetStatus, SpaceType } from "../../src/gameplay/shared/interfaces";
import { IPlayer } from "../../src/gameplay/player";
import { IBoard, Property } from "../../src/gameplay/board";
import { IStreet } from "../../src/gameplay/spaces/street";

describe("Game", () => {
  describe("Two players", () => {
    let game: Game;
    let player1: IPlayer;
    let player2: IPlayer;
    let player3: IPlayer;
    let board: IBoard;

    beforeEach(() => {
      // Create a game with three players
      const prePlayers: IPrePlayer[] = [
        { name: "player1", token: "token1" },
        { name: "player2", token: "token2" },
        { name: "player3", token: "token3" },
      ];
      game = new Game({ prePlayers });
      game.start();
      player1 = game.getSnapshot().players[0];
      player2 = game.getSnapshot().players[1];
      player3 = game.getSnapshot().players[2];
      board = game.getSnapshot().board;
    });

    test("Created Ok", () => {
      // Check game is created successfully
      expect(game.players).toHaveLength(3);
      expect(player1).toHaveProperty("token");
      expect(board).toHaveProperty("spaces");
      expect(game.currentPlayer).toEqual(player1);
    });

    test("Next turn Ok", () => {
      // Player1 throws the dice and move
      player1.throwDice().move();

      // Advance to player2's turn
      game.next();
      expect(game.currentPlayer).toEqual(player2);

      // Advance to player3's turn
      game.next();
      expect(game.currentPlayer).toEqual(player3);

      // Advance to player1's turn
      game.next();
      expect(game.currentPlayer).toEqual(player1);
    });

    test("Buying a street Ok", () => {
      // Purposefully let player1 moves to the second space on the map
      const steps = 1;
      player1.throwDice(steps).move();

      // Player1 buys the street
      const prop = board.spaces[player1.position] as Property;
      expect(game.playerBuyProp(player1, prop)).toEqual(true);

      expect(board.spaces[steps].type).toEqual(SpaceType.Street);
      expect((board.spaces[steps] as IStreet).status).toEqual(
        StreetStatus.Unimproved
      );
      expect(game.propToPlayer[prop.id]).toBe(player1);
    });

    test("Buying a street Fails (already purchased)", () => {
      // Purposefully let player1 moves to the second space on the map
      const steps = 1;
      player1.throwDice(steps).move();

      // Player1 buys the street
      const prop = board.spaces[player1.position] as Property;
      expect(game.playerBuyProp(player1, prop)).toEqual(true);

      expect(board.spaces[steps].type).toEqual(SpaceType.Street);
      expect((board.spaces[steps] as IStreet).status).toEqual(
        StreetStatus.Unimproved
      );
      expect(game.propToPlayer[prop.id]).toBe(player1);

      // Advance to player2
      game.next();
      expect(game.playerBuyProp(player2, prop)).toEqual(false);
      expect(game.propToPlayer[prop.id]).toBe(player1);
    });

    test("Paying rent for a street Ok", () => {
      // Purposefully let player1 moves to the second space on the map
      const steps = 1;
      player1.throwDice(steps).move();

      // Player1 buys the street
      const prop = board.spaces[player1.position] as Property;
      expect(game.playerBuyProp(player1, prop)).toEqual(true);

      // Advance to player2
      game.next();

      // Purposefully let player2 steps on player1's property
      // to pay rent
      player2.throwDice(steps).move();
      const player2OriginalMoney = player2.money;
      const rent = (board.spaces[steps] as IStreet).rent;
      player2.pay(rent).player(player1);

      expect(player2.money).toEqual(player2OriginalMoney - rent);
    });
  });
});
