import { IDice } from "./shared/interfaces";

export class Dice implements IDice {
  constructor() {}

  throw(): [number, number] {
    const number1 = Math.ceil(Math.random() * 6);
    const number2 = Math.ceil(Math.random() * 6);

    return [number1, number2];
  }
}
