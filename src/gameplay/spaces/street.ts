import { v4 as uuidv4 } from "uuid";
import { StreetStatus, SpaceType, IProperty } from "../shared/interfaces";

export class Street implements IStreet {
  id: string;
  name: string;
  type: SpaceType;
  rent: number;
  mortgage: number;
  status: StreetStatus;
  houseCost: number;
  houseSell: number;
  hotelCost: number;
  cost: number;
  rents: number[];

  constructor(parameters: any) {
    this.id = uuidv4();
    this.name = parameters.name;
    this.rent = parameters.rents[0];
    this.type = SpaceType.Street;
    this.mortgage = parameters.mortgage;
    this.status = StreetStatus.Unclaimed;
    this.houseCost = Number(parameters.houseCost);
    this.houseSell = Number(parameters.houseCost) / 2;
    this.hotelCost = Number(parameters.hotelCost);
    this.cost = Number(parameters.cost);
    this.rents = parameters.rents.map((r: number) => Number(r));
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

export interface IStreet extends IProperty {
  status: StreetStatus;
  houseCost: number;
  houseSell: number;
  hotelCost: number;

  doubleRent(): void;
  resetRent(): void;
}
