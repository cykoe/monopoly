import {IDice, IProperty, SpaceType} from "./shared/interfaces";
import {Dice} from "./dice";
import {Board, IBoard, Property} from "./board";
import {Player, IPlayer} from "./player";
import {IStreet} from "./spaces/street";
import {IRailRoad} from "./spaces/railroad";
import {IUtility} from "./spaces/utility";
import {Corner} from "./spaces/corners";

export const TOKENS = [
  "Scottish Terrier",
  "Battleship",
  "race car",
  "Top hat",
  "penguin",
  "t-rex",
  "cat",
  "rubber ducky",
];

const START_MONEY = 1500;

function shuffle(array: any) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export class Game implements IGame {
  static getTokens(): string[] {
    return TOKENS;
  }

  players: IPlayer[] = [];
  currentPlayer: IPlayer = {} as IPlayer;
  board: IBoard = {} as IBoard;
  dice: IDice;
  numOfPlayers: number;
  tracker: number = 0;
  playerToProps: PlayerToProps;
  propToPlayer: PropToPlayer;

  constructor(parameters: {players: IPlayerRaw[]}) {
    if (parameters.players.length < 2 || parameters.players.length > 8) {
      throw new Error("Players number must be 2-8");
    }
    this.dice = new Dice();
    this.numOfPlayers = parameters.players.length;
    this.createBoard();
    this.playerToProps = {};
    this.propToPlayer = {};
    // Create players from parameters
    this.players = parameters.players.map(
      (player: IPlayerRaw) =>
        new Player({
          name: player.name,
          money: START_MONEY,
          token: player.token,
          dice: this.dice,
        })
    );
    this.setPlayerOrders();
  }

  playerBuyProperty(player: IPlayer): boolean {
    // Locate the property the player is currently on
    const prop: IProperty = this.board.spaces[player.position] as IProperty;

    // If the player doesn't have the money to purchase the property,
    // or the property is already owned by somebody else, then this
    // transaction is failed
    if (player.money < prop.cost || this.propToPlayer[prop.id]) {
      return false;
    }

    // Initialize the player's properties to an empty array
    if (!this.playerToProps[player.id]) {
      this.playerToProps[player.id] = [];
    }

    // Deduct property cost from the player
    player.money -= prop.cost;

    // List the property to the player
    this.propToPlayer[prop.id] = player;

    // Set property status from unclaimed to unimproved
    prop.purchase();

    // For railroad and utility, automatically upgrade having multiple
    // TODO: add code for utility
    if (prop.type === SpaceType.Rail) {
      // Find other rail roads the player owns
      const otherRailRoads = this.playerToProps[player.id].filter(
        (p: IProperty) => p.type === SpaceType.Rail && p.id !== prop.id
      ) as IRailRoad[];

      // If the player owns more than one rail road (the current rail road)
      // Then upgrade other rail road by one level
      if (otherRailRoads.length) {
        otherRailRoads.forEach((railRoad: IRailRoad) => railRoad.upgrade());
      }

      // At last, upgrade the current railroad
      for (let i = 1; i < otherRailRoads.length; i++) {
        prop.upgrade();
      }
    }

    // Return true for successful transaction
    return true;
  }

  playerUpgradeProperty(player: IPlayer): boolean {
    // Locate the property the player is currently on
    const prop: IProperty = this.board.spaces[player.position] as IProperty;

    // Check if the property is already owned by another player
    if (this.propToPlayer[prop.id] !== player) {
      return false;
    }

    // Only Street has house to upgrade
    if (prop.type === SpaceType.Street) {
      // Check if the player has the money to upgrade
      if (player.money < (prop as IStreet).houseCost) {
        return false;
      } else {
        // Deduct house cost from the player
        player.money -= (prop as IStreet).houseCost;
      }
    }

    // Upgrade the property
    prop.upgrade();

    return true;
  }

  playerDowngradeProperty(player: IPlayer): boolean {
    // Locate the property the player is currently on
    const prop: IProperty = this.board.spaces[player.position] as IProperty;

    // Check if the property is already owned by another player
    if (this.propToPlayer[prop.id] !== player) {
      return false;
    }

    // Only Street has house to downgrade
    if (prop.type === SpaceType.Street) {
      // Add house sell to the player
      player.money += (prop as IStreet).houseSell;
    }

    // Upgrade the property
    prop.downgrade();

    return true;
  }

  playerMortgageProperty(player: IPlayer): boolean {
    // Locate the property the player in currently on
    const prop: IProperty = this.board.spaces[player.position] as IProperty;

    // Check if the property is already owned by another player
    if (this.propToPlayer[prop.id] !== player) {
      return false;
    }

    // If the property is a rail road or a utility, then we not only need to
    // set this property as mortgaged, but also downgrade other rail roads or
    // Utility if there are any
    if (prop.type === SpaceType.Rail) {
      const allRailRoads = this.playerToProps[player.id].filter(
        (p: IProperty) => p.type === SpaceType.Rail
      ) as IRailRoad[];

      allRailRoads.forEach((railRoad: IRailRoad) => railRoad.downgrade());
    }

    if (prop.type === SpaceType.Utility) {
      const allUtilities = this.playerToProps[player.id].filter(
        (p: IProperty) => p.type === SpaceType.Utility
      ) as IUtility[];

      allUtilities.forEach((utility: IUtility) => utility.downgrade());
    }

    // Player receives the mortgage money
    player.money += prop.mortgage;

    // Mortage the property
    return prop.setMortgage();
  }

  playerLiftMortgage(player: IPlayer): boolean {
    // Locate the property the player in currently on
    const prop: IProperty = this.board.spaces[player.position] as IProperty;

    if (!prop.isMortgaged || this.propToPlayer[prop.id] !== player) {
      return false;
    }

    if (player.money < prop.mortgage + prop.interest) {
      return false;
    }

    // Deduct property mortgage and interest from the player
    player.money -= prop.mortgage + prop.interest;

    return prop.liftMortgage();
  }

  next(): void {
    if (this.tracker !== this.numOfPlayers - 1) {
      this.tracker++;
    } else {
      this.tracker = 0;
    }
    this.currentPlayer = this.players[this.tracker];
  }

  start(): void {
    this.currentPlayer = this.players[this.tracker];
  }

  restart(): void {}

  createBoard(): void {
    this.board = new Board({});
  }

  setPlayerOrders(): void {
    shuffle(this.players);
  }

  getSnapshot(): ISnapshot {
    return {
      players: this.players,
      board: this.board,
    };
  }
}

export interface ISnapshot {
  players: IPlayer[];
  board: IBoard;
}

export interface IPlayerRaw {
  name: string;
  token: string;
}

type PlayerToProps = {[playerId: string]: IProperty[]};
type PropToPlayer = {[propId: string]: IPlayer};

export interface IGame {
  players: IPlayer[];
  currentPlayer: IPlayer;
  board: IBoard;
  dice: IDice;
  playerToProps: PlayerToProps;
  propToPlayer: PropToPlayer;
  numOfPlayers: number;
  tracker: number;

  playerBuyProperty(player: IPlayer): boolean;
  playerUpgradeProperty(player: IPlayer): boolean;
  playerDowngradeProperty(player: IPlayer): boolean;

  // Proceed to the next player
  next(): void;

  // Get a snapshot of the game
  getSnapshot(): ISnapshot;

  start(): void;
  restart(): void;

  // private methods used in prepare()
  createBoard(): void;
  setPlayerOrders(): void;
}
