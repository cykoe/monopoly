import { StreetStatus, SpaceType, IStreet } from "../shared/interfaces";

export class Street implements IStreet {
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
    this.rent = parameters.rents[0];
    this.type = SpaceType.Street;
    this.mortgage = parameters.mortgage;
    this.status = StreetStatus.Unclaimed;
    this.houseCost = parameters.houseCost;
    this.hotelCost = parameters.hotelCost;
    this.cost = parameters.cost;
    this.rents = parameters.rents;
  }

  purchase(): void {
    this.status = StreetStatus.Unimproved;
    this.rent = this.rents[1];
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
    if (this.status === StreetStatus.Unimproved) {
      this.rent = this.rents[StreetStatus.Unimproved];
    }
  }
}
