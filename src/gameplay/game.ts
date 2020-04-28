import { IGame, IPlayer, IBoard, IDice, IPrePlayer } from "./shared/interfaces";
import { Dice } from "./dice";
import { Board } from "./board";
import { Player } from "./player";

const TOKENS = [
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

// TODO: space object array
const SPACES = [{}];

export class Game implements IGame {
  players: IPlayer[] = [];
  currentPlayer: IPlayer = {} as IPlayer;
  board: IBoard = {} as IBoard;
  dice: IDice;
  prePlayers: IPrePlayer[] = [];
  numOfPlayers: number;
  tracker: number = 0;

  constructor(parameters: any) {
    if (parameters.prePlayers < 2 || parameters.prePlayers > 8) {
      throw new Error("Players number must be 2-8");
    }
    this.dice = new Dice();
    this.prePlayers = parameters.prePlayers;
    this.numOfPlayers = this.prePlayers.length;
  }

  next(): void {
    if (this.tracker == this.numOfPlayers - 1) {
      this.tracker++;
      this.currentPlayer = this.players[this.tracker];
    }
  }

  prepare(): void {
    this.createBoard();
    this.getTokenNames();
    this.createPlayers();
    this.setPlayerOrders();
  }

  start(): void {
    this.currentPlayer = this.players[this.tracker];
  }

  restart(): void {
    this.prepare();
  }

  createBoard(): void {
    this.board = new Board({ spaces: SPACES });
  }

  getTokenNames(): string[] {
    return TOKENS;
  }

  createPlayers(): void {
    this.players = this.prePlayers.map(
      (player: IPrePlayer) =>
        new Player({
          name: player.name,
          money: START_MONEY,
          token: player.token,
          dice: this.dice,
        })
    );
  }

  setPlayerOrders(): void {
    shuffle(this.players);
  }
}
