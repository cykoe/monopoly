import {Game, IPlayerRaw, TOKENS} from "../../src/gameplay/game";
import {
  StreetStatus,
  SpaceType,
  RailRoadStatus,
} from "../../src/gameplay/shared/interfaces";
import {IPlayer} from "../../src/gameplay/player";
import {
  IBoard,
  Property,
  TOTAL_STEPS,
  GO_MONEY,
} from "../../src/gameplay/board";
import {IStreet} from "../../src/gameplay/spaces/street";
import {IRailRoad} from "../../src/gameplay/spaces/railroad";
import {IUtility} from "../../src/gameplay/spaces/utility";

let game: Game;
let player1: IPlayer;
let player2: IPlayer;
let board: IBoard;

const MEDITERRANEAN_AVE = 1;
const READING_RAIL_ROAD = 5;
const PENNSYLVANIA_RAIL_ROAD = 15;
const ELECTRIC_COMPANY = 12;
const WATER_WORKS = 28;

describe("Game", () => {
  describe("One player", () => {
    expect(() => {
      new Game({players: [{name: "player1", token: "token1"}]});
    }).toThrow();
  });

  describe("Nine player", () => {
    expect(() => {
      new Game({players: new Array(9).fill({})});
    }).toThrow();
  });

  describe("Two players", () => {
    beforeEach(() => {
      // Create a game with two players
      const players: IPlayerRaw[] = [
        {name: "player1", token: "token1"},
        {name: "player2", token: "token2"},
      ];
      game = new Game({players});
      game.start();
      player1 = game.getSnapshot().players[0];
      player2 = game.getSnapshot().players[1];
      board = game.getSnapshot().board;
    });

    test("Get Tokens", () => {
      expect(Game.getTokens()).toEqual(TOKENS);
    });

    test("Game created Ok", () => {
      // Check game is created successfully
      expect(game.players).toHaveLength(2);
      expect(player1).toHaveProperty("token");
      expect(board).toHaveProperty("spaces");
      expect(game.currentPlayer).toEqual(player1);
    });

    test("Next turn Ok", () => {
      // Player1 throws the dice and move
      player1.throw().move();

      // Advance to player2's turn
      game.next();
      expect(game.currentPlayer).toEqual(player2);

      // Advance to player1's turn
      game.next();
      expect(game.currentPlayer).toEqual(player1);
    });

    describe("Street", () => {
     //test("Player1 buys one rail road", () => {
        //player1.throw(READING_RAIL_ROAD).move();
        //game.playerBuyProperty(player1);
        //const railRoad = board.spaces[player1.position] as IRailRoad;

        //expect(game.propToPlayer[railRoad.id]).toBe(player1);
        //expect(game.playerToProps[player1.id]).toContain(railRoad);
      //});

      //test("Player1 buys two rail roads and player2 pays the rent", () => {
        //// Player1 buys two rail roads
        //player1.throw(READING_RAIL_ROAD).move();
        //game.playerBuyProperty(player1);
        //player1.throw(PENNSYLVANIA_RAIL_ROAD - READING_RAIL_ROAD).move();
        //game.playerBuyProperty(player1);
        //const player1StartMoney = player1.money;

        //// Player2 moves to one of the rail roads
        //player2.throw(READING_RAIL_ROAD).move();
        //const railRoad = board.spaces[player2.position] as IRailRoad;
        //const rent = railRoad.getRent();
        //const player2StartMoney = player2.money;
        //expect(rent).toEqual(railRoad.rents[RailRoadStatus.TwoRail]);

        //// Player2 pays player1 for the rent
        //player2.pay(rent).player(player1);
        //expect(player1.money).toEqual(player1StartMoney + rent);
        //expect(player2.money).toEqual(player2StartMoney - rent);
      //});

      test("Player1 buys two utilities and player2 pays the rent", () => {
        const player1StartMoney = player1.money;
        player1.throw(ELECTRIC_COMPANY).move();
        game.playerBuyProperty(player1);
        const electric_company = board.spaces[player1.position] as IUtility;
        player1.throw(WATER_WORKS - ELECTRIC_COMPANY).move();
        game.playerBuyProperty(player1);
        const water_works = board.spaces[player1.position] as IUtility;
        const player1AfterBuyingMoney = player1.money;
        expect(player1.money).toEqual(
          player1StartMoney - electric_company.cost - water_works.cost
        );

        player2.throw(ELECTRIC_COMPANY).move();
        const rent = (board.spaces[player2.position] as IUtility).getRent(
          player2.getDiceThrow()
        );
        const player2StartMoney = player2.money;
        expect(rent).toEqual(electric_company.getRent(player2.getDiceThrow()));

        player2.pay(rent).player(player1);
        expect(player2.money).toEqual(player2StartMoney - rent);
        expect(player1.money).toEqual(player1AfterBuyingMoney + rent);
      });
    });
  });
});
