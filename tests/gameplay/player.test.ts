import { Player } from "../../src/gameplay/player";
import { Dice } from "../../src/gameplay/dice";
import { PlayerStatus } from "../../src/gameplay/shared/interfaces";
import {JAIL, TOTAL_STEPS, GO_MONEY} from "../../src/gameplay/board";

describe("Player", () => {
  let player1: Player;
  const player_param = {
    name: "name",
    money: 1500,
    token: "captain",
    dice: new Dice(),
  };

  beforeEach(() => {
    player1 = new Player(player_param);
  });

  test("pay another player successful", () => {
    const player2 = new Player(player_param);
    const player1StartMoney = player1.money;
    const player2StartMoney = player2.money;
    // set a tenth of money to pay, making sure the transaction successful
    const amount = player1StartMoney / 10;

    expect(player1.pay(amount).player(player2)).toEqual(true);
    expect(player1.money).toEqual(player1StartMoney - amount);
    expect(player2.money).toEqual(player2StartMoney + amount);
  });

  test("pay another player fails due to insufficient money", () => {
    const player2 = new Player(player_param);
    const player1StartMoney = player1.money;
    const player2StartMoney = player2.money;
    // set twice the amount has to pay, make sure the transaction fail
    const amount = player1StartMoney * 2;

    expect(player1.pay(amount).player(player2)).toEqual(false);
    expect(player1.money).toEqual(player1StartMoney);
    expect(player2.money).toEqual(player2StartMoney);
  });

  test("pay tax successful", () => {
    const player1StartMoney = player1.money;
    // set a tenth of money to pay, making sure the transaction successful
    const amount = player1StartMoney / 10;

    expect(player1.pay(amount).tax()).toEqual(true);
    expect(player1.money).toEqual(player1StartMoney - amount);
  });

  test("pay tax fails due to insufficient money", () => {
    const player1StartMoney = player1.money;
    // set twice of money to pay, making sure the transaction fail
    const amount = player1StartMoney * 2;

    expect(player1.pay(amount).tax()).toEqual(false);
    expect(player1.money).toEqual(player1StartMoney);
  });

  test("throwDice", () => {
    player1.throw();
    const diceResult = player1._tempDice;

    expect(diceResult).toHaveLength(2);
    expect(diceResult[0]).toBeGreaterThan(0);
    expect(diceResult[0]).toBeLessThan(7);
    expect(diceResult[1]).toBeGreaterThan(0);
    expect(diceResult[1]).toBeLessThan(7);
  });

  test("throw the dice and move", () => {
    const player1StartPosition = player1.position;
    player1.throw().move();
    const diceResult = player1._tempDice;

    expect(player1.position).toEqual(
      player1StartPosition + diceResult[0] + diceResult[1]
    );
  });

  test("Go to jail after stepping on Go to Jail", () => {
    player1.throw(JAIL).move();

    expect(player1.status).toEqual(PlayerStatus.Jail);
  });

  // TODO: write how to get out from jail method
  //test("freeFromJail()", () => {
    //player1.throwDice(JAIL).move();

    ////

    //expect(player1.status).toEqual(PlayerStatus.Free);
  //});

  test("Collect salary after passing Go", () => {
    // Purposefully let player1 moves around the board to collect salary
    player1.throw(TOTAL_STEPS + 1).move();

    expect(player1.money).toEqual(player_param.money + GO_MONEY);
  });
});
