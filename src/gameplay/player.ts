import {
  IPlayer,
  IToken,
  IStreet,
  IRailRoad,
  IUtility,
  PlayerStatus,
  IDice,
  IChance,
  ICommunity,
} from "./shared/interfaces";
import { Token } from "./token";

export class Player implements IPlayer {
  name: string;
  money: number;
  token: IToken;
  properties: (IStreet | IRailRoad | IUtility)[];
  status: PlayerStatus;
  totalWorth: number;
  dice: IDice;

  // for payment
  _tempAmount: number;

  constructor(parameters: any) {
    this.name = parameters.name;
    this.money = parameters.money;
    this.token = {} as IToken;
    this.properties = [];
    this.status = PlayerStatus.Free;
    this.totalWorth = 0;
    this._tempAmount = 0;
    this.dice = parameters.dice;

    this.createToken(parameters.token);
  }

  buy(prop: IStreet | IRailRoad | IUtility): void {}
  sell(prop: IStreet | IRailRoad | IUtility): void {}
  improve(prop: IStreet | IRailRoad | IUtility): void {}

  createToken(name: string): void {
    const token = new Token({ name });
    this.token = token;
  }

  pay(amount: number): this {
    this._tempAmount = amount;
    return this;
  }

  toRent(player: IPlayer): void {
    if (this.money > this._tempAmount) {
      this.money -= this._tempAmount;
      player.money += this._tempAmount;
    }
  }

  toTax(): void {
    if (this.money > this._tempAmount) {
      this.money -= this._tempAmount;
    }
  }

  throwDice(): [number, number] {
    return this.dice.throw();
  }

  goToJail(): void {
    this.status = PlayerStatus.Jail;
  }

  freeFromJail(): void {
    this.status = PlayerStatus.Free;
  }

  drawChance(chance: IChance): void {}
  drawCommunity(community: ICommunity): void {}

  collectSalary(): void {}
}
