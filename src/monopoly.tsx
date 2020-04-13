interface IToken {
  name: string;
}

enum PropertyStatus {
  Unimproved,
  OneHouse,
  TwoHouse,
  ThreeHouse,
  FourHouse,
  Hotel,
  Mortgage,
}

enum RailRoadStatus {
  OneRail,
  TwoRail,
  ThreeRail,
  FourRail,
  Mortgage,
}

enum UtilityStatus {
  OneUtility,
  TwoUtility,
}

enum PlayerStatus {
  Jail,
  Free,
}

interface IProperty {
  name: string;
  rent: number;
  mortgage: number;
}

interface IStreet extends IProperty {
  status: PropertyStatus;
  houseCost: number;
  hotelCost: number;
  minHouse4Hotel: number;
}

interface IRailRoad extends IProperty {
  status: RailRoadStatus;
}

interface IUtility extends IProperty {
  status: UtilityStatus;
}

interface IPlayer {
  name: string;
  money: number;
  token: IToken;
  properties: IProperty[];
  status: PlayerStatus;
  totalWorth: number;
}

interface IChance {
  name: string;
}

interface ICommunity {
  name: string;
}

interface ITax {
  name: string;
  amount: number;
}

enum SpaceStatus {
  Street,
  Utility,
  Rail,
  Community,
  Chance,
  Tax,
  ToJail,
  JailOrVisit,
  Parking,
  Go,
}

interface ISpace {
  name: string;
  status: SpaceStatus;
}

interface Board {
  spaces: ISpace[];
  tokens: IToken[];
}

class Game {
  constructor(parameters) {}

  createPlayers(numOfPlayers: number) {}

  createBoard() {}
}
