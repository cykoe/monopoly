import { SpaceType, IParking } from "../shared/interfaces";

export class Parking implements IParking {
  name: string;
  type: SpaceType;

  constructor(parameters: any) {
    this.name = parameters.name;
    this.type = SpaceType.Parking;
  }
}
