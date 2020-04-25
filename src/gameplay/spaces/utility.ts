import { UtilityStatus, SpaceType, IUtility } from "../shared/interfaces";

export class Utility implements IUtility {
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

  purchase(): void {
    this.status = UtilityStatus.OneUtility;
    this.rent = this.rents[UtilityStatus.OneUtility];
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
      this.rent = this.rents[this.status];
    }
  }

  downgrade(): void {
    if (this.status > UtilityStatus.OneUtility) {
      this.status--;
      this.rent = this.rents[this.status];
    }
  }

  setMortgage(): void {
    this.status = UtilityStatus.Mortgage;
    this.rent = this.rents[UtilityStatus.Unclaimed];
  }
}
