import { Game, IPrePlayer, TOKENS } from "../../src/gameplay/game";
import { StreetStatus, SpaceType } from "../../src/gameplay/shared/interfaces";
import { IPlayer } from "../../src/gameplay/player";
import {
  IBoard,
  Property,
  TOTAL_STEPS,
  GO_MONEY,
} from "../../src/gameplay/board";
import { IStreet } from "../../src/gameplay/spaces/street";
import { IRailRoad } from "../../src/gameplay/spaces/railroad";
import {IUtility} from "../../src/gameplay/spaces/utility";

let game: Game;
let player1: IPlayer;
let player2: IPlayer;
let board: IBoard;
const MEDITERRANEAN_AVE = 1;
const READING_RR = 5;
const PENNSYLVANIA_RR = 15;
const ELECTRIC_COMPANY = 12;
const WATER_WORKS = 28; 

describe("Game", () => {
  describe("One player", () => {
    expect(() => {
      new Game({ prePlayers: [{ name: "player1", token: "token1" }] });
    }).toThrow();
  });

  describe("Nine player", () => {
    expect(() => {
      new Game({ prePlayers: new Array(9).fill({}) });
    }).toThrow();
  });

  describe("Two players", () => {
    beforeEach(() => {
      // Create a game with three players
      const prePlayers: IPrePlayer[] = [
        { name: "player1", token: "token1" },
        { name: "player2", token: "token2" },
      ];
      game = new Game({ prePlayers });
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
      test("Player1 buying a street Ok", () => {
        // Purposefully let player1 moves to the second space on the map
        player1.throw(MEDITERRANEAN_AVE).move();

        // Player1 buys the street
        const prop = board.spaces[player1.position] as Property;
        const player1StartMoney = player1.money;
        expect(game.playerBuyProp(player1)).toEqual(true);

        expect(board.spaces[MEDITERRANEAN_AVE].type).toEqual(SpaceType.Street);
        expect((board.spaces[MEDITERRANEAN_AVE] as IStreet).status).toEqual(
          StreetStatus.Unimproved
        );
        expect(game.propToPlayer[prop.id]).toBe(player1);
        expect(player1.money).toEqual(player1StartMoney - prop.cost);
      });

      test("Player2 fails to buy the street owned by player1", () => {
        // Purposefully let player1 moves to the second space on the map
        player1.throw(MEDITERRANEAN_AVE).move();

        // Player1 buys the street
        const prop = board.spaces[player1.position] as Property;
        expect(game.playerBuyProp(player1)).toEqual(true);

        expect(board.spaces[MEDITERRANEAN_AVE].type).toEqual(SpaceType.Street);
        expect((board.spaces[MEDITERRANEAN_AVE] as IStreet).status).toEqual(
          StreetStatus.Unimproved
        );
        expect(game.propToPlayer[prop.id]).toBe(player1);

        // Advance to player2
        game.next();
        player2.throw(MEDITERRANEAN_AVE).move();
        expect(game.playerBuyProp(player2)).toEqual(false);
        expect(game.propToPlayer[prop.id]).toBe(player1);
      });

      test("Player2 pays player1 for rent", () => {
        // Purposefully let player1 moves to the second space on the map
        player1.throw(MEDITERRANEAN_AVE).move();

        // Player1 buys the street
        expect(game.playerBuyProp(player1)).toEqual(true);

        // Advance to player2
        game.next();

        // Purposefully let player2 steps on player1's property
        // to pay rent
        player2.throw(MEDITERRANEAN_AVE).move();
        const player2OriginalMoney = player2.money;
        const rent = (board.spaces[MEDITERRANEAN_AVE] as IStreet).getRent();
        player2.pay(rent).player(player1);

        expect(player2.money).toEqual(player2OriginalMoney - rent);
      });

      test("Player1 upgrades the street to one house", () => {
        player1.throw(MEDITERRANEAN_AVE).move();
        const player1StartMoney = player1.money;
        game.playerBuyProp(player1);

        // Let player1 move to the same location after one round
        player1.throw(TOTAL_STEPS).move();

        const prop = board.spaces[player1.position] as IStreet;
        expect(game.playerUpgradeProp(player1)).toEqual(true);
        expect(prop.status).toEqual(StreetStatus.OneHouse);

        const player1EndMoney =
          player1StartMoney - prop.cost + GO_MONEY - prop.houseCost;
        expect(player1.money).toEqual(player1EndMoney);
      });

      test("Player1 cannot upgrade its property with insufficient money", () => {
        player1.throw(MEDITERRANEAN_AVE).move();
        game.playerBuyProp(player1);

        // Let player1 move to the same location after one round
        player1.throw(TOTAL_STEPS).move();
        player1.money = 0;

        expect(game.playerUpgradeProp(player2)).toEqual(false);
      });

      test("Player2 cannot upgrade owned property", () => {
        player1.throw(MEDITERRANEAN_AVE).move();
        game.playerBuyProp(player1);

        game.next();

        player2.throw(MEDITERRANEAN_AVE).move();
        expect(game.playerUpgradeProp(player2)).toEqual(false);
      });

      test("Player1 upgrades the street to one house and downgrade to unimproved", () => {
        player1.throw(MEDITERRANEAN_AVE).move();
        const player1StartMoney = player1.money;
        const prop = board.spaces[player1.position] as IStreet;
        game.playerBuyProp(player1);

        // Let player1 move to the same location after one round
        player1.throw(TOTAL_STEPS).move();
        expect(game.playerUpgradeProp(player1)).toEqual(true);
        expect(prop.status).toEqual(StreetStatus.OneHouse);

        // Let player1 move to the same location after two rounds
        player1.throw(TOTAL_STEPS).move();
        expect(game.playerDowngradeProp(player1)).toEqual(true);
        expect(prop.status).toEqual(StreetStatus.Unimproved);

        const player1EndMoney =
          player1StartMoney -
          prop.cost +
          GO_MONEY * 2 -
          prop.houseCost +
          prop.houseSell;
        expect(player1.money).toEqual(player1EndMoney);
      });

      test("Player1 upgrades the street to a hotel", () => {
        player1.throw(MEDITERRANEAN_AVE).move();
        const player1StartMoney = player1.money;
        game.playerBuyProp(player1);
        const prop = board.spaces[player1.position] as IStreet;

        // Let player1 move to the same location after one round
        player1.throw(TOTAL_STEPS).move();
        // Upgrade to one house
        expect(game.playerUpgradeProp(player1)).toEqual(true);
        expect(prop.status).toEqual(StreetStatus.OneHouse);

        // Let player1 move to the same location after two rounds
        player1.throw(TOTAL_STEPS).move();
        // Upgrade to two house
        expect(game.playerUpgradeProp(player1)).toEqual(true);
        expect(prop.status).toEqual(StreetStatus.TwoHouse);

        // Let player1 move to the same location after three rounds
        player1.throw(TOTAL_STEPS).move();
        // Upgrade to three house
        expect(game.playerUpgradeProp(player1)).toEqual(true);
        expect(prop.status).toEqual(StreetStatus.ThreeHouse);

        // Let player1 move to the same location after four rounds
        player1.throw(TOTAL_STEPS).move();
        // Upgrade to four house
        expect(game.playerUpgradeProp(player1)).toEqual(true);
        expect(prop.status).toEqual(StreetStatus.FourHouse);

        // Let player1 move to the same location after five rounds
        player1.throw(TOTAL_STEPS).move();
        // Upgrade to a hotel
        expect(game.playerUpgradeProp(player1)).toEqual(true);
        expect(prop.status).toEqual(StreetStatus.Hotel);

        const player1EndMoney =
          player1StartMoney - prop.cost + GO_MONEY * 5 - prop.houseCost * 5;
        expect(player1.money).toEqual(player1EndMoney);
      });

      test("Player2 pays player1 for hotel rent", () => {
        // Let player goes around the board five times to upgrade to a hotel
        player1.throw(MEDITERRANEAN_AVE).move();
        game.playerBuyProp(player1);
        player1.throw(TOTAL_STEPS).move();
        game.playerUpgradeProp(player1);
        player1.throw(TOTAL_STEPS).move();
        game.playerUpgradeProp(player1);
        player1.throw(TOTAL_STEPS).move();
        game.playerUpgradeProp(player1);
        player1.throw(TOTAL_STEPS).move();
        game.playerUpgradeProp(player1);
        player1.throw(TOTAL_STEPS).move();
        game.playerUpgradeProp(player1);
        const player1StartMoney = player1.money;

        // Let player2 moves to the hotel property
        player2.throw(MEDITERRANEAN_AVE).move();
        const player2StartMoney = player2.money;

        // Get the rent of the hotel
        const rent = (board.spaces[player2.position] as IStreet).getRent();
        player2.pay(rent).player(player1);
        expect(player2.money).toEqual(player2StartMoney - rent);
        expect(player1.money).toEqual(player1StartMoney + rent);
      });

      test("Player1 buys two rail roads and player2 pays the rent", () => {
        player1.throw(READING_RR).move();
        game.playerBuyProp(player1);
        player1.throw(PENNSYLVANIA_RR - READING_RR).move();
        game.playerBuyProp(player1);
        const player1StartMoney = player1.money;

        player2.throw(READING_RR).move();
        const rent = (board.spaces[player2.position] as IRailRoad).getRent();
        const player2StartMoney = player2.money;
        expect(rent).toEqual(50);

        player2.pay(rent).player(player1);
        expect(player2.money).toEqual(player2StartMoney - rent);
        expect(player1.money).toEqual(player1StartMoney + rent);
      });

      test("Player1 buys two utilities and player2 pays the rent", () => {
        const player1StartMoney = player1.money;
        player1.throw(ELECTRIC_COMPANY).move();
        game.playerBuyProp(player1);
        const electric_company = board.spaces[player1.position] as IUtility;
        player1.throw(WATER_WORKS - ELECTRIC_COMPANY).move();
        game.playerBuyProp(player1);
        const water_works = board.spaces[player1.position] as IUtility;
        const player1AfterBuyingMoney = player1.money;
        expect(player1.money).toEqual(player1StartMoney - electric_company.cost - water_works.cost);

        player2.throw(ELECTRIC_COMPANY).move();
        const rent = (board.spaces[player2.position] as IUtility).getRent(player2.getDiceThrow());
        const player2StartMoney = player2.money;
        expect(rent).toEqual(electric_company.getRent(player2.getDiceThrow()));

        player2.pay(rent).player(player1);
        expect(player2.money).toEqual(player2StartMoney - rent);
        expect(player1.money).toEqual(player1AfterBuyingMoney + rent);
      });
    });
  });
});
