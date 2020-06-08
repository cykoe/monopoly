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
  _rent: number;
  mortgage: number;
  // List of rents for each stage of the property
  rents: number[];
  isMortgaged: boolean;
  interest: number; 

  getRent(steps?: number): number;
  purchase(): void;
  upgrade(): void;
  downgrade(): void;
  setMortgage(): boolean;
  liftMortgage(): boolean;
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

// TODO: move mortgage to the first element
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
