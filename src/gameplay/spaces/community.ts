import { ISpace, SpaceType, ICommunity } from "../shared/interfaces";

export class Community implements ICommunity {
  name: string;
  type: SpaceType;

  constructor(parameters: any) {
    this.name = parameters.name;
    this.type = SpaceType.Community;
  }

  func(): void {
    return;
  }
}
