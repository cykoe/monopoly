import { SpaceType, IToJail } from "../shared/interfaces";

export class ToJail implements IToJail {
  name: string;
  type: SpaceType;

  constructor(parameters: any) {
    this.name = parameters.name;
    this.type = SpaceType.ToJail;
  }
}
