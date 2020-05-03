import { IDice, IProperty } from "./shared/interfaces";
import { Dice } from "./dice";
import { Board, IBoard, Property } from "./board";
import { Player, IPlayer } from "./player";

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
  prePlayers: IPrePlayer[] = [];
  numOfPlayers: number;
  tracker: number = 0;
  playerToProps: PlayerToProps;
  propToPlayer: PropToPlayer;

  constructor(parameters: any) {
    if (parameters.prePlayers < 2 || parameters.prePlayers > 8) {
      throw new Error("Players number must be 2-8");
    }
    this.dice = new Dice();
    this.prePlayers = parameters.prePlayers;
    this.numOfPlayers = this.prePlayers.length;
    this.createBoard();
    this.playerToProps = {};
    this.propToPlayer = {};
    // Create players from parameters
    this.players = this.prePlayers.map(
      (player: IPrePlayer) =>
        new Player({
          name: player.name,
          money: START_MONEY,
          token: player.token,
          dice: this.dice,
        })
    );
    this.setPlayerOrders();
  }

  playerBuyProp(player: IPlayer, prop: Property): boolean {
    if (player.money < prop.cost || this.propToPlayer[prop.id]) {
      return false;
    }

    if (!this.playerToProps[player.id]) {
      this.playerToProps[player.id] = [];
    }

    this.playerToProps[player.id].push(prop);
    this.propToPlayer[prop.id] = player;

    // Set property status from unclaimed to unimproved
    prop.upgrade();

    // Return true for successful transaction
    return true;
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

export interface IPrePlayer {
  name: string;
  token: string;
}

type PlayerToProps = { [playerId: string]: Property[] };
type PropToPlayer = { [propId: string]: IPlayer };

export interface IGame {
  players: IPlayer[];
  currentPlayer: IPlayer;
  board: IBoard;
  dice: IDice;
  prePlayers: IPrePlayer[];
  playerToProps: PlayerToProps;
  propToPlayer: PropToPlayer;
  numOfPlayers: number;
  tracker: number;

  playerBuyProp(player: IPlayer, prop: Property): boolean;

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
