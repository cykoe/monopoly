import { RailRoadStatus, SpaceType, IRailRoad } from "../shared/interfaces";

export class RailRoad implements IRailRoad {
  name: string;
  type: SpaceType;
  cost: number;
  rent: number;
  mortgage: number;
  status: RailRoadStatus;
  rents: number[];

  constructor(parameters: any) {
    this.status = RailRoadStatus.Unclaimed;
    this.rent = parameters.rent;
    this.name = parameters.name;
    this.mortgage = parameters.mortgage;
    this.rents = parameters.rents;
    this.cost = parameters.cost;
    this.type = SpaceType.Rail;
  }

  getRent(): number {
    return this.rent;
  }

  upgrade(): void {
    if (this.status < RailRoadStatus.FourRail) {
      this.status++;
      this.rent = this.rents[this.status];
    }
  }

  downgrade(): void {
    if (this.status > RailRoadStatus.OneRail) {
      this.status--;
      this.rent = this.rents[this.status];
    }
  }

  setMortgage(): void {
    this.status = RailRoadStatus.Mortgage;
    this.rent = this.rents[RailRoadStatus.Unclaimed];
  }
}
