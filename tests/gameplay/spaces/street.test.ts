import {IStreet} from "../../../src/gameplay/spaces/street";
import {StreetStatus, SpaceType} from "../../../src/gameplay/shared/interfaces";
import {Game, IPlayerRaw} from "../../../src/gameplay/game";
import {IPlayer} from "../../../src/gameplay/player";
import {
  IBoard,
  Property,
  TOTAL_STEPS,
  GO_MONEY,
} from "../../../src/gameplay/board";

let game: Game;
let chloe: IPlayer;
let lucy: IPlayer;
let board: IBoard;

const MEDITERRANEAN_AVE = 1;

describe("Street", () => {
  beforeEach(() => {
    const players: IPlayerRaw[] = [
      {name: "chloe", token: "token1"},
      {name: "lucy", token: "token2"},
    ];
    game = new Game({players});
    game.start();
    chloe = game.getSnapshot().players[0];
    lucy = game.getSnapshot().players[1];
    board = game.getSnapshot().board;
  });

  test("Chloe purchases a street", () => {
    // Chloe moves to mediterranean avenue
    chloe.throw(MEDITERRANEAN_AVE).move();

    // PlayerOne buys the street
    const prop = board.spaces[chloe.position] as IStreet;
    const ChloeStartMoney = chloe.money;
    expect(game.playerBuyProperty(chloe)).toEqual(true);

    expect(board.spaces[MEDITERRANEAN_AVE].type).toEqual(SpaceType.Street);
    expect((board.spaces[MEDITERRANEAN_AVE] as IStreet).status).toEqual(
      StreetStatus.Unimproved
    );
    expect(game.propToPlayer[prop.id]).toBe(chloe);
    expect(chloe.money).toEqual(ChloeStartMoney - prop.cost);
  });

  test("Lucy fails to buy the street owned by Chloe", () => {
    // Purposefully let Chloe moves to the second space on the map
    chloe.throw(MEDITERRANEAN_AVE).move();

    // Chloe buys the street
    const prop = board.spaces[chloe.position] as Property;
    expect(game.playerBuyProperty(chloe)).toEqual(true);

    expect(board.spaces[MEDITERRANEAN_AVE].type).toEqual(SpaceType.Street);
    expect((board.spaces[MEDITERRANEAN_AVE] as IStreet).status).toEqual(
      StreetStatus.Unimproved
    );
    expect(game.propToPlayer[prop.id]).toBe(chloe);

    // Advance to Lucy
    game.next();
    lucy.throw(MEDITERRANEAN_AVE).move();
    expect(game.playerBuyProperty(lucy)).toEqual(false);
    expect(game.propToPlayer[prop.id]).toBe(chloe);
  });

  test("Lucy pays Chloe for rent", () => {
    // Purposefully let Chloe moves to the second space on the map
    chloe.throw(MEDITERRANEAN_AVE).move();

    // Chloe buys the street
    expect(game.playerBuyProperty(chloe)).toEqual(true);

    // Advance to Lucy
    game.next();

    // Purposefully let Lucy steps on Chloe's property
    // to pay rent
    lucy.throw(MEDITERRANEAN_AVE).move();
    const LucyStartMoney = lucy.money;
    const rent = (board.spaces[MEDITERRANEAN_AVE] as IStreet).getRent();
    lucy.pay(rent).player(chloe);

    expect(lucy.money).toEqual(LucyStartMoney - rent);
  });

  test("Chloe upgrades the street to one house", () => {
    chloe.throw(MEDITERRANEAN_AVE).move();
    const ChloeStartMoney = chloe.money;
    game.playerBuyProperty(chloe);

    // Let Chloe move to the same location after one round
    chloe.throw(TOTAL_STEPS).move();

    const prop = board.spaces[chloe.position] as IStreet;
    expect(game.playerUpgradeProperty(chloe)).toEqual(true);
    expect(prop.status).toEqual(StreetStatus.OneHouse);

    const ChloeEndMoney =
      ChloeStartMoney - prop.cost + GO_MONEY - prop.houseCost;
    expect(chloe.money).toEqual(ChloeEndMoney);
  });

  test("Chloe cannot upgrade its property with insufficient money", () => {
    chloe.throw(MEDITERRANEAN_AVE).move();
    game.playerBuyProperty(chloe);

    // Let Chloe move to the same location after one round
    chloe.throw(TOTAL_STEPS).move();
    chloe.money = 0;

    expect(game.playerUpgradeProperty(lucy)).toEqual(false);
  });

  test("Lucy cannot upgrade owned property", () => {
    chloe.throw(MEDITERRANEAN_AVE).move();
    game.playerBuyProperty(chloe);

    game.next();

    lucy.throw(MEDITERRANEAN_AVE).move();
    expect(game.playerUpgradeProperty(lucy)).toEqual(false);
  });

  test("Chloe upgrades the street to one house and downgrade to unimproved", () => {
    chloe.throw(MEDITERRANEAN_AVE).move();
    const ChloeStartMoney = chloe.money;
    const prop = board.spaces[chloe.position] as IStreet;
    game.playerBuyProperty(chloe);

    // Let Chloe move to the same location after one round
    chloe.throw(TOTAL_STEPS).move();
    expect(game.playerUpgradeProperty(chloe)).toEqual(true);
    expect(prop.status).toEqual(StreetStatus.OneHouse);

    // Let Chloe move to the same location after two rounds
    chloe.throw(TOTAL_STEPS).move();
    expect(game.playerDowngradeProperty(chloe)).toEqual(true);
    expect(prop.status).toEqual(StreetStatus.Unimproved);

    const ChloeEndMoney =
      ChloeStartMoney -
      prop.cost +
      GO_MONEY * 2 -
      prop.houseCost +
      prop.houseSell;
    expect(chloe.money).toEqual(ChloeEndMoney);
  });

  test("Chloe upgrades the street to a hotel", () => {
    chloe.throw(MEDITERRANEAN_AVE).move();
    const ChloeStartMoney = chloe.money;
    game.playerBuyProperty(chloe);
    const prop = board.spaces[chloe.position] as IStreet;

    // Let Chloe move to the same location after one round
    chloe.throw(TOTAL_STEPS).move();
    // Upgrade to one house
    expect(game.playerUpgradeProperty(chloe)).toEqual(true);
    expect(prop.status).toEqual(StreetStatus.OneHouse);

    // Let Chloe move to the same location after two rounds
    chloe.throw(TOTAL_STEPS).move();
    // Upgrade to two house
    expect(game.playerUpgradeProperty(chloe)).toEqual(true);
    expect(prop.status).toEqual(StreetStatus.TwoHouse);

    // Let Chloe move to the same location after three rounds
    chloe.throw(TOTAL_STEPS).move();
    // Upgrade to three house
    expect(game.playerUpgradeProperty(chloe)).toEqual(true);
    expect(prop.status).toEqual(StreetStatus.ThreeHouse);

    // Let Chloe move to the same location after four rounds
    chloe.throw(TOTAL_STEPS).move();
    // Upgrade to four house
    expect(game.playerUpgradeProperty(chloe)).toEqual(true);
    expect(prop.status).toEqual(StreetStatus.FourHouse);

    // Let Chloe move to the same location after five rounds
    chloe.throw(TOTAL_STEPS).move();
    // Upgrade to a hotel
    expect(game.playerUpgradeProperty(chloe)).toEqual(true);
    expect(prop.status).toEqual(StreetStatus.Hotel);

    const ChloeEndMoney =
      ChloeStartMoney - prop.cost + GO_MONEY * 5 - prop.houseCost * 5;
    expect(chloe.money).toEqual(ChloeEndMoney);
  });

  test("Lucy pays Chloe for hotel rent", () => {
    // Let player goes around the board five times to upgrade to a hotel
    chloe.throw(MEDITERRANEAN_AVE).move();
    game.playerBuyProperty(chloe);
    chloe.throw(TOTAL_STEPS).move();
    game.playerUpgradeProperty(chloe);
    chloe.throw(TOTAL_STEPS).move();
    game.playerUpgradeProperty(chloe);
    chloe.throw(TOTAL_STEPS).move();
    game.playerUpgradeProperty(chloe);
    chloe.throw(TOTAL_STEPS).move();
    game.playerUpgradeProperty(chloe);
    chloe.throw(TOTAL_STEPS).move();
    game.playerUpgradeProperty(chloe);
    const ChloeStartMoney = chloe.money;

    // Let Lucy moves to the hotel property
    lucy.throw(MEDITERRANEAN_AVE).move();
    const LucyStartMoney = lucy.money;

    // Get the rent of the hotel
    const rent = (board.spaces[lucy.position] as IStreet).getRent();
    lucy.pay(rent).player(chloe);
    expect(lucy.money).toEqual(LucyStartMoney - rent);
    expect(chloe.money).toEqual(ChloeStartMoney + rent);
  });

  test("Chloe mortages unbought street failed", () => {
    chloe.throw(MEDITERRANEAN_AVE).move();
    expect(game.playerMortgageProperty(chloe)).toEqual(false);
  });

  describe("Chloe mortgages her property", () => {
    let chloeStartMoney: number;

    beforeEach(() => {
      chloeStartMoney = chloe.money;
      chloe.throw(MEDITERRANEAN_AVE).move();
      game.playerBuyProperty(chloe);
    });

    test("the property is unimproved)", () => {
      const prop = board.spaces[chloe.position] as IStreet;
      game.playerMortgageProperty(chloe);

      expect(prop.status).toEqual(StreetStatus.Mortgage);
      expect(chloe.money).toEqual(chloeStartMoney - prop.cost + prop.mortgage);
    });

    test("the property has existing houses", () => {
      const prop = board.spaces[chloe.position] as IStreet;
      game.playerUpgradeProperty(chloe);
      game.playerUpgradeProperty(chloe);

      expect(prop.status).toEqual(StreetStatus.TwoHouse);
      expect(game.playerMortgageProperty(chloe)).toEqual(false);
      expect(prop.status).toEqual(StreetStatus.TwoHouse);
    });

    test("the property has houses and chloe removes them", () => {
      const prop = board.spaces[chloe.position] as IStreet;
      game.playerUpgradeProperty(chloe);
      game.playerUpgradeProperty(chloe);
      game.playerDowngradeProperty(chloe);
      game.playerDowngradeProperty(chloe);
      game.playerMortgageProperty(chloe);
      expect(prop.status).toEqual(StreetStatus.Mortgage);
      expect(chloe.money).toEqual(
        chloeStartMoney -
          prop.cost -
          prop.houseCost * 2 +
          prop.houseSell * 2 +
          prop.mortgage
      );
    });
  });
  // TODO: write lifting the mortgage
  //describe("Chloe lifts the mortgage", () => {
    //let chloeStartMoney: number;
    //beforeEach(() => {
      //chloeStartMoney = chloe.money;
      //chloe.throw(MEDITERRANEAN_AVE).move();
      //game.playerBuyProperty(chloe);
      //game.playerMortgageProperty(chloe);
    //});

    //test("the property is lifted", () => {
       
    //});

  //});
});
