export interface IDice {
  throw(): [number, number];
}

export interface ISpace {
  name: string;
  type: SpaceType;
}

export interface IProperty extends ISpace {
  id: string;
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
