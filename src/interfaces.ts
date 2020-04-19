export interface IToken {
  name: string;
  currentPosition: number;

  move(steps: number): boolean;
  goTo(pos: number): void;
  goToJail(): void;
}

// TODO: player throw a dice
export interface IDice {
  throw(): number;
}

export interface ISpace {
  name: string;
  type: SpaceType;
}

export interface IProperty extends ISpace {
  rent: number;
  mortgage: number;
  costs: number[];

  gerRent(steps: number): number;
  improveProperty(): void;
  removeProperty(): void;
  setMortgage(): void;
}

export interface IStreet extends IProperty {
  status: StreetStatus;
  houseCost: number;
  hotelCost: number;
  minHouse4Hotel: number;

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
}

export interface IBoard {
  properties: (
    | IStreet
    | IRailRoad
    | IUtility
    | IChance
    | ICommunity
    | ITax
    | IJail
    | IToJail
    | IParking
    | IGo
  )[];
  tokens: IToken[];

  // private methods in constructor
  createProperties(
    obj: any
  ): (
    | IStreet
    | IRailRoad
    | IUtility
    | IChance
    | ICommunity
    | ITax
    | IJail
    | IToJail
    | IParking
    | IGo
  )[];
}

export interface IPrePlayer {
  name: string;
  token: string;
}

export interface IGame {
  players: IPlayer[];
  currentPlayer: IPlayer;
  board: IBoard;

  // proceed to the next player
  next(): void;

  prepare(): void;
  start(): void;
  restart(): void;

  // private methods used in prepare()
  createBoard(): IBoard;
  getTokenNames: string[];
  createPlayers(players: IPrePlayer[]): IPlayer[];
  setPlayerOrders(): void;
}

export enum StreetStatus {
  Unimproved,
  OneHouse,
  TwoHouse,
  ThreeHouse,
  FourHouse,
  Hotel,
  Mortgage,
}

export enum RailRoadStatus {
  OneRail,
  TwoRail,
  ThreeRail,
  FourRail,
  Mortgage,
}

export enum UtilityStatus {
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

