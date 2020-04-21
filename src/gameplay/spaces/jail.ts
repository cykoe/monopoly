import { SpaceType, IJail } from "../shared/interfaces";

export class Jail implements IJail {
  name: string;
  type: SpaceType;

  constructor(parameters: any) {
    this.name = parameters.name;
    this.type = SpaceType.Jail;
  }
}
