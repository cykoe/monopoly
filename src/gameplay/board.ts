import * as data from "../assets/board.json";
import {
  IStreet,
  IRailRoad,
  IUtility,
  IChance,
  ICommunity,
  ITax,
  IJail,
  IToJail,
  IParking,
  IGo,
} from "./shared/interfaces";

type Space =
  | IStreet
  | IRailRoad
  | IUtility
  | IChance
  | ICommunity
  | ITax
  | IJail
  | IToJail
  | IParking
  | IGo;

export interface IBoard {
  spaces: Space[];

  // private methods in constructor
  createSpaces(obj: any): void;
}

export class Board implements IBoard {
  spaces: Space[] = [];

  constructor(parameters: any) {
    this.createSpaces();
  }

  // TODO: load board data
  createSpaces(): void {
    console.log(data);
  }
}
