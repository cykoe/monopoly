import { ISpace, SpaceType, IChance } from "../shared/interfaces";

export class Chance implements IChance {
  name: string;
  type: SpaceType;

  constructor(parameters: any) {
    this.name = parameters.name;
    this.type = SpaceType.Chance;
  }

  func(): void {
    return;
  }
}
