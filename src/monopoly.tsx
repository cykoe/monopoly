// TODO: move this to NODE in typescript
const TOTALSTEPS = 40;
const JAILPOS = 10;
interface IToken {
  name: string;
  currentPosition: number;
  // return true if pass Go, else false
  move(steps: number): boolean;
  goToJail(): void;

  // some chest/chance card moves token
  goTo(pos: number): void;
}

class Token implements IToken {
  name: string;
  currentPosition: number;

  constructor(parameters) {
    this.name = parameters.name;
    // position from 0 - 39
    this.currentPosition = 0;
  }

  // move
  move(steps: number): boolean {
    this.currentPosition += steps;
    if (this.currentPosition >= TOTALSTEPS) {
      this.currentPosition -= TOTALSTEPS;
      return true;
    }

    return false;
  }

  goToJail(): void {
    this.currentPosition = JAILPOS;
  }

  goTo(pos: number) {
    this.currentPosition = pos;
  }
}

enum StreetStatus {
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
  Mortgage,
}

enum PlayerStatus {
  Jail,
  Free,
}

interface IDice {
  // generate a random number from 2 to 12
  throw(): number;
}

class Dice implements IDice {
  constructor(parameters) {}

  throw(): number {
    let number1 = Math.floor(Math.random() * 6);
    let number2 = Math.floor(Math.random() * 6);

    return number1 + number2;
  }
}

interface IProperty {
  name: string;
  rent: number;
  mortgage: number;
  costs: number[];

  gerRent(steps: number): number;
  improveProperty(): void;
  removeProperty(): void;
  setMortgage(): void;
}

interface IStreet extends IProperty {
  status: StreetStatus;
  houseCost: number;
  hotelCost: number;
  minHouse4Hotel: number;

  doubleRent(): void;
  resetRent(): void;
}

class Street implements IStreet {
  name: string;
  rent: number;
  mortgage: number;
  status: StreetStatus;
  houseCost: number;
  hotelCost: number;
  minHouse4Hotel: number;
  costs: number[];

  constructor(parameters) {
    this.name = parameters.name;
    this.rent = parameters.rent;
    this.mortgage = parameters.mortgage;
    this.houseCost = parameters.houseCost;
    this.hotelCost = parameters.hotelCost;
    this.minHouse4Hotel = parameters.minHouse4Hotel;
    // costs in an ordered array with 6 elements from unimproved to hotel
    this.costs = parameters.costs;

    this.status = StreetStatus.Unimproved;
  }

  gerRent(steps: number): number {
    return this.rent;
  }

  improveProperty(): void {
    if (this.status < StreetStatus.Hotel) {
      this.status++;
      this.rent = this.costs[this.status];
    }
  }

  removeProperty(): void {
    if (this.status > StreetStatus.Unimproved) {
      this.status--;
      this.rent = this.costs[this.status];
    }
  }

  setMortgage(): void {
    this.status = StreetStatus.Mortgage;
    this.rent = 0;
  }

  // owning the same color the rent would double unimproved rent
  doubleRent(): void {
    if (this.status === StreetStatus.Unimproved) {
      this.rent = 2 * this.rent;
    }
  }

  resetRent(): void {
    this.rent = this.costs[StreetStatus.Unimproved];
  }
}

interface IRailRoad extends IProperty {
  status: RailRoadStatus;
}

class RailRoad implements IRailRoad {
  name: string;
  rent: number;
  mortgage: number;
  status: RailRoadStatus;
  costs: number[];

  constructor(parameters) {
    this.status = RailRoadStatus.OneRail;
    this.rent = parameters.rent;
    this.name = parameters.name;
    this.mortgage = parameters.mortgage;
    this.costs = parameters.costs;
  }

  gerRent(steps: number): number {
    return this.rent;
  }

  improveProperty(): void {
    if (this.status < RailRoadStatus.FourRail) {
      this.status++;
      this.rent = costs[this.status];
    }
  }

  removeProperty(): void {
    if (this.status > RailRoadStatus.OneRail) {
      this.status--;
      this.rent = costs[this.status];
    }
  }

  setMortgage(): void {
    this.status = RailRoadStatus.Mortgage;
    this.rent = 0;
  }
}
interface IUtility extends IProperty {
  status: UtilityStatus;
}

class Utility implements IUtility {
  name: string;
  rent: number;
  mortgage: number;
  status: UtilityStatus;
  costs: number[];

  constructor(parameters) {
    this.status = UtilityStatus.OneUtility;
    this.rent = parameters.rent;
    this.name = parameters.name;
    this.mortgage = parameters.mortgage;
    this.costs = parameters.costs;
  }

  gerRent(steps: number): number {
    if (this.status !== UtilityStatus.Mortgage) {
      // rent is equal to x amount times the dice rolls
      return this.costs[this.status] * steps;
    } else {
      // if it's mortgaged, no rent fee
      return 0;
    }
  }

  improveProperty(): void {
    if (this.status < UtilityStatus.TwoUtility) {
      this.status++;
    }
  }

  removeProperty(): void {
    if (this.status > UtilityStatus.OneUtility) {
      this.status--;
    }
  }

  setMortgage(): void {
    this.status = UtilityStatus.Mortgage;
  }
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
