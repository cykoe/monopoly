import { SpaceType, IGo } from "../shared/interfaces";

export class Go implements IGo {
  name: string;
  type: SpaceType;

  constructor(parameters: any) {
    this.name = parameters.name;
    this.type = SpaceType.Tax;
  }
}
