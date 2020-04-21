import { IToken } from "./shared/interfaces";

const TOTAL_STEPS = 40;
const JAIL_POS = 10;

export class Token implements IToken {
  name: string;
  currentPosition: number;

  constructor(parameters: any) {
    this.name = parameters.name;
    // position from 0 - 39
    this.currentPosition = 0;
  }

  move(steps: number): boolean {
    this.currentPosition += steps;
    if (this.currentPosition >= TOTAL_STEPS) {
      this.currentPosition -= TOTAL_STEPS;
      return true;
    }

    return false;
  }

  goToJail(): void {
    this.currentPosition = JAIL_POS;
  }

  goTo(pos: number) {
    this.currentPosition = pos;
  }
}
