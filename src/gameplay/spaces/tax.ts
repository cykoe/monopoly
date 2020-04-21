import { SpaceType, ITax } from "../shared/interfaces";

export class Tax implements ITax {
  name: string;
  type: SpaceType;
  amount: number;

  constructor(parameters: any) {
    this.name = parameters.name;
    this.type = SpaceType.Tax;
    this.amount = parameters.amount;
  }
}
