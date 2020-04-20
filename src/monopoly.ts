import {
  Space,
  IPlayer,
  IPrePlayer,
  IBoard,
  IGame,
  IToken,
  IDice,
  IStreet,
  IRailRoad,
  IUtility,
  StreetStatus,
  SpaceType,
  RailRoadStatus,
  UtilityStatus,
  IChance,
  ICommunity,
  ITax,
  IJail,
  IParking,
  IToJail,
  IGo,
  PlayerStatus,
} from "./interfaces";

import * as data from "./assets/board.json";

const TOTAL_STEPS = 40;
const JAIL_POS = 10;
const START_MONEY = 1500;
const TOKENS = [
  "Scottish Terrier",
  "Battleship",
  "race car",
  "Top hat",
  "penguin",
  "t-rex",
  "cat",
  "rubber ducky",
];

function shuffle(array: any) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// TODO: space object array
const SPACES = [{}];

class Token implements IToken {
  name: string;
  currentPosition: number;

  constructor(parameters: any) {
    this.name = parameters.name;
    // position from 0 - 39
    this.currentPosition = 0;
  }

  move(steps: number): boolean {
    this.currentPosition += steps;
    if (this.currentPosition >= TOTAL_STEPS) {
      this.currentPosition -= TOTAL_STEPS;
      return true;
    }

    return false;
  }

  goToJail(): void {
    this.currentPosition = JAIL_POS;
  }

  goTo(pos: number) {
    this.currentPosition = pos;
  }
}

class Dice implements IDice {
  constructor() {}

  throw(): [number, number] {
    let number1 = Math.floor(Math.random() * 6);
    let number2 = Math.floor(Math.random() * 6);

    return [number1, number2];
  }
}

class Street implements IStreet {
  name: string;
  type: SpaceType;
  rent: number;
  mortgage: number;
  status: StreetStatus;
  houseCost: number;
  hotelCost: number;
  cost: number;
  rents: number[];

  constructor(parameters: any) {
    this.name = parameters.name;
    this.rent = parameters.rent;
    this.type = SpaceType.Street;
    this.mortgage = parameters.mortgage;
    this.status = StreetStatus.Unclaimed;
    this.houseCost = parameters.houseCost;
    this.hotelCost = parameters.hotelCost;
    this.cost = parameters.cost;
    // rents in an ordered array with 6 elements from unimproved to hotel
    this.rents = parameters.rents;
  }

  getRent(): number {
    return this.rent;
  }

  upgrade(): void {
    if (this.status < StreetStatus.Hotel) {
      this.status++;
      this.rent = this.rents[this.status];
    }
  }

  downgrade(): void {
    if (this.status > StreetStatus.Unimproved) {
      this.status--;
      this.rent = this.rents[this.status];
    }
  }

  setMortgage(): void {
    this.status = StreetStatus.Mortgage;
    this.rent = this.rents[StreetStatus.Unclaimed];
  }

  // owning the same color the rent would double unimproved rent
  doubleRent(): void {
    if (this.status === StreetStatus.Unimproved) {
      this.rent = 2 * this.rent;
    }
  }

  resetRent(): void {
    this.rent = this.rents[StreetStatus.Unimproved];
  }
}

class RailRoad implements IRailRoad {
  name: string;
  type: SpaceType;
  cost: number;
  rent: number;
  mortgage: number;
  status: RailRoadStatus;
  rents: number[];

  constructor(parameters: any) {
    this.status = RailRoadStatus.Unclaimed;
    this.rent = parameters.rent;
    this.name = parameters.name;
    this.mortgage = parameters.mortgage;
    this.rents = parameters.rents;
    this.cost = parameters.cost;
    this.type = SpaceType.Rail;
  }

  getRent(): number {
    return this.rent;
  }

  upgrade(): void {
    if (this.status < RailRoadStatus.FourRail) {
      this.status++;
      this.rent = this.rents[this.status];
    }
  }

  downgrade(): void {
    if (this.status > RailRoadStatus.OneRail) {
      this.status--;
      this.rent = this.rents[this.status];
    }
  }

  setMortgage(): void {
    this.status = RailRoadStatus.Mortgage;
    this.rent = this.rents[RailRoadStatus.Unclaimed];
  }
}

class Utility implements IUtility {
  name: string;
  rent: number;
  mortgage: number;
  status: UtilityStatus;
  rents: number[];
  cost: number;
  type: SpaceType;

  constructor(parameters: any) {
    this.status = UtilityStatus.Unclaimed;
    this.rent = parameters.rent;
    this.name = parameters.name;
    this.mortgage = parameters.mortgage;
    this.rents = parameters.rents;
    this.cost = parameters.cost;
    this.type = SpaceType.Utility;
  }

  getRent(steps: number): number {
    if (this.status !== UtilityStatus.Mortgage) {
      // rent is equal to x amount times the dice rolls
      return this.rents[this.status] * steps;
    } else {
      // if it's mortgaged, no rent fee
      return 0;
    }
  }

  upgrade(): void {
    if (this.status < UtilityStatus.TwoUtility) {
      this.status++;
    }
  }

  downgrade(): void {
    if (this.status > UtilityStatus.OneUtility) {
      this.status--;
    }
  }

  setMortgage(): void {
    this.status = UtilityStatus.Mortgage;
    this.rent = this.rents[UtilityStatus.Unclaimed];
  }
}

class Chance implements IChance {
  name: string;
  type: SpaceType;

  constructor(parameters: any) {
    this.name = parameters.name;
    this.type = SpaceType.Chance;
  }

  func(): void {
    return;
  }
}

class Community implements ICommunity {
  name: string;
  type: SpaceType;

  constructor(parameters: any) {
    this.name = parameters.name;
    this.type = SpaceType.Community;
  }

  func(): void {
    return;
  }
}

class Tax implements ITax {
  name: string;
  type: SpaceType;
  amount: number;

  constructor(parameters: any) {
    this.name = parameters.name;
    this.type = SpaceType.Tax;
    this.amount = parameters.amount;
  }
}

class Jail implements IJail {
  name: string;
  type: SpaceType;

  constructor(parameters: any) {
    this.name = parameters.name;
    this.type = SpaceType.Jail;
  }
}

class Parking implements IParking {
  name: string;
  type: SpaceType;

  constructor(parameters: any) {
    this.name = parameters.name;
    this.type = SpaceType.Parking;
  }
}

class ToJail implements IToJail {
  name: string;
  type: SpaceType;

  constructor(parameters: any) {
    this.name = parameters.name;
    this.type = SpaceType.ToJail;
  }
}

class Go implements IGo {
  name: string;
  type: SpaceType;

  constructor(parameters: any) {
    this.name = parameters.name;
    this.type = SpaceType.Tax;
  }
}

class Player implements IPlayer {
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

class Board implements IBoard {
  spaces: Space[] = [];

  constructor(parameters: any) {
    this.createSpaces(parameters.spaces);
  }

  // TODO: load board data
  createSpaces(obj: any): void {
    console.log(data);
  }
}

class Game implements IGame {
  players: IPlayer[] = [];
  currentPlayer: IPlayer = {} as IPlayer;
  board: IBoard = {} as IBoard;
  dice: IDice;
  prePlayers: IPrePlayer[] = [];
  numOfPlayers: number;
  tracker: number = 0;

  constructor(parameters: any) {
    if (parameters.prePlayers < 2 || parameters.prePlayers > 8) {
      throw new Error("Players number must be 2-8");
    }
    this.dice = new Dice();
    this.prePlayers = parameters.prePlayers;
    this.numOfPlayers = this.prePlayers.length;
  }

  next(): void {
    if (this.tracker == this.numOfPlayers - 1) {
      this.tracker++;
      this.currentPlayer = this.players[this.tracker];
    }
  }

  prepare(): void {
    this.createBoard();
    this.getTokenNames();
    this.createPlayers();
    this.setPlayerOrders();
  }

  start(): void {
    this.currentPlayer = this.players[this.tracker];
  }

  restart(): void {
    this.prepare();
  }

  createBoard(): void {
    this.board = new Board({ spaces: SPACES });
  }

  getTokenNames(): string[] {
    return TOKENS;
  }

  createPlayers(): void {
    this.players = this.prePlayers.map(
      (player: IPrePlayer) =>
        new Player({
          name: player.name,
          money: START_MONEY,
          token: player.token,
          dice: this.dice,
        })
    );
  }

  setPlayerOrders(): void {
    shuffle(this.players);
  }
}
