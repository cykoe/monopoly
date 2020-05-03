import { ISpace, SpaceType } from "../shared/interfaces";

export class Corner implements ISpace {
  name: string;
  type: SpaceType;

  constructor(parameters: any) {
    this.name = parameters.name;
    switch (parameters.spaceType) {
      case "Jail":
        this.type = SpaceType.Jail;
        break;
      case "GoToJail":
        this.type = SpaceType.ToJail;
        break;
      case "Go":
        this.type = SpaceType.Go;
        break;
      case "Parking":
        this.type = SpaceType.Parking;
        break;
      default:
        this.type = SpaceType.Go;
        break;
    }
  }
}
