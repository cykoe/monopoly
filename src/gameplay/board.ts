import * as data from "../assets/board.json";
import {IChance, ICommunity, ITax, ISpace} from "./shared/interfaces";
import {IStreet, Street} from "./spaces/street";
import {IRailRoad, RailRoad} from "./spaces/railroad";
import {Utility, IUtility} from "./spaces/utility";
import {Chance} from "./spaces/chance";
import {Community} from "./spaces/community";
import {Tax} from "./spaces/tax";
import {Corner} from "./spaces/corners";

// Total number of spaces in the game
export const TOTAL_STEPS = 40;

// Go position on the board
export const GO = 0;

// Money collected after passing GO
export const GO_MONEY = 200;

// Jail position on the board
export const JAIL = 10;

// Free Parking position on the board
export const PARKING = 20;

// Go To Jail position on the board
export const GO_TO_JAIL = 30;

type Space =
  | IStreet
  | IRailRoad
  | IUtility
  | IChance
  | ICommunity
  | ITax
  | ISpace;

export type Property = IStreet | IRailRoad | IUtility;

export interface IBoard {
  spaces: Space[];
}

export class Board implements IBoard {
  spaces: Space[] = [];

  constructor(parameters: any) {
    this.spaces = parseData();
  }
}
parseData();
function parseData(): Space[] {
  const result: Space[] = [];
  for (let index = 0; index < 40; index++) {
    const d = data[index];
    switch (d["Space"]) {
      case "Street":
        let mortgage = Number(d["Price"]) / 2;
        let rents = [
          0,
          d["Rent"],
          d["RentBuild1"],
          d["RentBuild2"],
          d["RentBuild3"],
          d["RentBuild4"],
          d["RentBuild5"],
          0,
        ];
        let cost = d["Price"];
        let name = d["Name"];
        let houseCost = d["PriceBuild"];
        let hotelCost = d["PriceBuild"];

        const street = new Street({
          name,
          rents,
          mortgage,
          cost,
          houseCost,
          hotelCost,
        });
        result.push(street);
        break;
      case "Railroad":
        mortgage = Number(d["Price"]) / 2;
        // hard code for multiple railroad price
        rents = [0, d["Rent"], 50, 100, 200, 0];
        cost = d["Price"];
        name = d["Name"];

        const railroad = new RailRoad({name, cost, rents, mortgage});
        result.push(railroad);
        break;
      case "Utility":
        mortgage = Number(d["Price"]) / 2;
        // hard code for multiple utility price
        rents = [0, d["Rent"], 10, 0];
        cost = d["Price"];
        name = d["Name"];

        const utility = new Utility({name, cost, rents, mortgage});
        result.push(utility);
        break;
      case "Chance":
        result.push(new Chance({name: d["Name"]}));
        break;
      case "Chest":
        result.push(new Community({name: d["Name"]}));
        break;
      case "Tax":
        result.push(new Tax({amount: d["Rent"], name: d["Name"]}));
        break;
      case "Jail":
        result.push(new Corner({spaceType: "Jail", name: d["Name"]}));
        break;
      case "GoToJail":
        result.push(new Corner({spaceType: "GoToJail", name: d["Name"]}));
        break;
      case "Go":
        result.push(new Corner({spaceType: "Go", name: d["Name"]}));
        break;
      case "Parking":
        result.push(new Corner({spaceType: "Parking", name: d["Name"]}));
        break;
      default:
        break;
    }
  }

  return result;
}
