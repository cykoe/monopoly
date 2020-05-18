import { v4 as uuidv4 } from "uuid";
import { PlayerStatus, IDice, IChance, ICommunity } from "./shared/interfaces";
import {TOTAL_STEPS, GO_MONEY, JAIL} from "./board";


export class Player implements IPlayer {
  id: string;
  name: string;
  money: number;
  token: string;
  status: PlayerStatus;
  netWorth: number;
  dice: IDice;
  position: number;
  _tempAmount: number;
  _tempDice: [number, number];

  constructor(parameters: any) {
    this.id = uuidv4();
    this.name = parameters.name;
    this.money = parameters.money;
    this.token = parameters.token;
    // Initialize player as free
    this.status = PlayerStatus.Free;
    this.netWorth = 0;
    this._tempAmount = 0;
    this._tempDice = [0, 0];
    this.dice = parameters.dice;

    // Position ranges from 0 - 39
    this.position = 0;
  }

  // Return true if the token passes Go
  move(): boolean {
    this.position += this._tempDice[0] + this._tempDice[1];

    // Collect salary after passing Go
    if (this.position > TOTAL_STEPS) {
      this.position -= TOTAL_STEPS;

      // Since it overflows, it means the players pases Go
      this.collectSalary();
      return true;
    }

    // Go to jail
    if(this.position == JAIL) {
      this.goToJail();
      return false;
    }

    // The player hasn't passed Go
    return false;
  }

  pay(amount: number): this {
    this._tempAmount = amount;
    return this;
  }

  getDiceThrow(): number {
    return this._tempDice[0] + this._tempDice[1];
  }

  player(player: IPlayer): boolean {
    if (this.money > this._tempAmount) {
      this.money -= this._tempAmount;
      player.money += this._tempAmount;
      return true;
    }
    return false;
  }

  getSnapshot(): IPlayerSnapshot {
    return {
      name: this.name,
      money: this.money,
      netWorth: this.netWorth,
      status: this.status,
      position: this.position,
    };
  }

  tax(): boolean {
    if (this.money > this._tempAmount) {
      this.money -= this._tempAmount;
      return true;
    }
    return false;
  }

  throw(steps?: number): this {
    // for debugging
    if (steps) {
      this._tempDice = [1, steps - 1];
    } else {
      this._tempDice = this.dice.throw();
    }
    return this;
  }

  private goToJail(): void {
    this.status = PlayerStatus.Jail;
  }

  private freeFromJail(): void {
    this.status = PlayerStatus.Free;
  }

  // Collect salary after passing go
  private collectSalary(): void {
    this.money += GO_MONEY;
  }

  drawChance(chance: IChance): void {}
  drawCommunity(community: ICommunity): void {}
}

export interface IPlayer {
  id: string;
  name: string;
  // Cash value the player currently holds
  money: number;
  token: string;
  status: PlayerStatus;
  // All assets the players owns, including cash, houses, etc.
  netWorth: number;
  dice: IDice;
  // Current position that the player is at on the board
  position: number;

  // Amount of payment for either a player, tax, or cards
  _tempAmount: number;

  // Dice thrown
  _tempDice: [number, number];

  // Get the most recent dice throw
  getDiceThrow(): number;

  // Methods to chain for paying a player, tax, or cards
  pay(amount: number): this;

  // Move a player's position on the board
  move(): boolean;

  // True if transaction is successful
  player(player: IPlayer): boolean;

  // True if transaction is successful
  tax(): boolean;

  // Returns two values from two dice throw
  throw(steps?: number): this;

  drawChance(chance: IChance): void;
  drawCommunity(community: ICommunity): void;

  // Get an overall status of the player
  getSnapshot(): IPlayerSnapshot;

  // TODO: auction for unwanted property
}

export interface IPlayerSnapshot {
  name: string;
  money: number;
  netWorth: number;
  status: PlayerStatus;
  position: number;
}
