import {v4 as uuidv4} from "uuid";
import {RailRoadStatus, SpaceType, IProperty} from "../shared/interfaces";

const MORTGAGE_INTEREST = 0.1;

export class RailRoad implements IRailRoad {
  id: string;
  name: string;
  type: SpaceType;
  cost: number;
  _rent: number;
  mortgage: number;
  status: RailRoadStatus;
  rents: number[];
  interest: number;
  isMortgaged: boolean;

  constructor(parameters: any) {
    this.id = uuidv4();
    this.status = RailRoadStatus.Unclaimed;
    // Set rent to that in one railroad status
    this.name = parameters.name;
    this.mortgage = parameters.mortgage;
    this.rents = parameters.rents;
    this._rent = parameters.rents[0];
    this.cost = parameters.cost;
    this.type = SpaceType.Rail;
    this.interest = MORTGAGE_INTEREST;
    this.isMortgaged = false;
  }

  liftMortgage(): boolean {
    return true;
  }

  purchase(): void {
    this.status = RailRoadStatus.OneRail;
    this._rent = this.rents[RailRoadStatus.OneRail];
  }

  getRent(): number {
    return this._rent;
  }

  upgrade(): void {
    if (this.status < RailRoadStatus.FourRail) {
      this.status++;
      this._rent = this.rents[this.status];
    }
  }

  downgrade(): void {
    if (this.status > RailRoadStatus.OneRail) {
      this.status--;
      this._rent = this.rents[this.status];
    }
  }

  setMortgage(): boolean {
    if (
      this.status === RailRoadStatus.Mortgage ||
      this.status === RailRoadStatus.Unclaimed
    ) {
      return false;
    }
    this.status = RailRoadStatus.Mortgage;
    this._rent = this.rents[RailRoadStatus.Unclaimed];
    return true;
  }
}

export interface IRailRoad extends IProperty {
  status: RailRoadStatus;
}
