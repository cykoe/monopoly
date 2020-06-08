import {v4 as uuidv4} from "uuid";
import {UtilityStatus, SpaceType, IProperty} from "../shared/interfaces";

export class Utility implements IUtility {
  id: string;
  name: string;
  _rent: number;
  mortgage: number;
  status: UtilityStatus;
  rents: number[];
  cost: number;
  type: SpaceType;

  constructor(parameters: any) {
    this.id = uuidv4();
    this.status = UtilityStatus.Unclaimed;
    this._rent = parameters.rent;
    this.name = parameters.name;
    this.mortgage = parameters.mortgage;
    this.rents = parameters.rents;
    this.cost = parameters.cost;
    this.type = SpaceType.Utility;
  }

  purchase(): void {
    this.status = UtilityStatus.OneUtility;
    this._rent = this.rents[UtilityStatus.OneUtility];
  }

  getRent(steps: number): number {
    if (!steps) {
      throw new Error("Steps is needed to calculate rent");
    }
    if (this.status !== UtilityStatus.Mortgage) {
      // rent is equal to x amount times the dice rolls
      return this._rent * steps;
    } else {
      // if it's mortgaged, no rent fee
      return 0;
    }
  }

  upgrade(): void {
    if (this.status < UtilityStatus.TwoUtility) {
      this.status++;
      this._rent = this.rents[this.status];
    }
  }

  downgrade(): void {
    if (this.status > UtilityStatus.OneUtility) {
      this.status--;
      this._rent = this.rents[this.status];
    }
  }

  setMortgage(): boolean {
    if (
      this.status === UtilityStatus.Mortgage ||
      this.status === UtilityStatus.Unclaimed
    ) {
      return false;
    }
    this.status = UtilityStatus.Mortgage;
    this._rent = this.rents[UtilityStatus.Unclaimed];
    return true;
  }
}

export interface IUtility extends IProperty {
  status: UtilityStatus;
}
