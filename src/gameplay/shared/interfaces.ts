export interface IToken {
  name: string;
  currentPosition: number;

  // return a list of options for the user to select
  move(steps: number): boolean;
  goTo(pos: number): void;
  goToJail(): void;
}

export interface IDice {
  throw(): [number, number];
}

export interface ISpace {
  name: string;
  type: SpaceType;
}

export interface IProperty extends ISpace {
  cost: number;
  rent: number;
  mortgage: number;
  // list of rents for each stage of the property
  rents: number[];

  getRent(steps?: number): number;
  purchase(): void;
  upgrade(): void;
  downgrade(): void;
  setMortgage(): void;
}

export interface IStreet extends IProperty {
  status: StreetStatus;
  houseCost: number;
  hotelCost: number;

  doubleRent(): void;
  resetRent(): void;
}

export interface IRailRoad extends IProperty {
  status: RailRoadStatus;
}

export interface IUtility extends IProperty {
  status: UtilityStatus;
}

// TODO: make base change/community cards
export interface IChance extends ISpace {
  func(): void;
}

export interface ICommunity extends ISpace {
  func(): void;
}

export interface ITax extends ISpace {
  amount: number;
}

export interface IJail extends ISpace {}

export interface IParking extends ISpace {}

export interface IToJail extends ISpace {}

export interface IGo extends ISpace {}

export interface IPlayer {
  name: string;
  money: number;
  token: IToken;
  properties: (IStreet | IRailRoad | IUtility)[];
  status: PlayerStatus;
  totalWorth: number;
  dice: IDice;

  // for payment
  _tempAmount: number;

  buy(prop: IStreet | IRailRoad | IUtility): void;
  sell(prop: IStreet | IRailRoad | IUtility): void;
  improve(prop: IStreet | IRailRoad | IUtility): void;
  createToken(name: string): void;

  // methods chaining to pay rent
  pay(amount: number): this;
  toRent(player: IPlayer): void;
  toTax(): void;

  throwDice(): [number, number];

  goToJail(): void;
  freeFromJail(): void;

  drawChance(chance: IChance): void;
  drawCommunity(community: ICommunity): void;

  collectSalary(): void;

  // TODO: auction for unwanted property
}

export type Space =
  | IStreet
  | IRailRoad
  | IUtility
  | IChance
  | ICommunity
  | ITax
  | IJail
  | IToJail
  | IParking
  | IGo;

export interface IBoard {
  spaces: Space[];

  // private methods in constructor
  createSpaces(obj: any): void;
}

export interface IPrePlayer {
  name: string;
  token: string;
}

export interface IGame {
  players: IPlayer[];
  currentPlayer: IPlayer;
  board: IBoard;
  dice: IDice;
  prePlayers: IPrePlayer[];
  numOfPlayers: number;
  tracker: number;

  // proceed to the next player
  next(): void;

  prepare(): void;
  start(): void;
  restart(): void;

  // private methods used in prepare()
  createBoard(): void;
  getTokenNames(): string[];
  createPlayers(players: IPrePlayer[]): void;
  setPlayerOrders(): void;
}

export enum StreetStatus {
  Unclaimed,
  Unimproved,
  OneHouse,
  TwoHouse,
  ThreeHouse,
  FourHouse,
  Hotel,
  Mortgage,
}

export enum RailRoadStatus {
  Unclaimed,
  OneRail,
  TwoRail,
  ThreeRail,
  FourRail,
  Mortgage,
}

export enum UtilityStatus {
  Unclaimed,
  OneUtility,
  TwoUtility,
  Mortgage,
}

export enum PlayerStatus {
  Jail,
  Free,
}

export enum SpaceType {
  Street,
  Utility,
  Rail,
  Community,
  Chance,
  Tax,
  ToJail,
  Jail,
  Parking,
  Go,
}

