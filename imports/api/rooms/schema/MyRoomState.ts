import {MapSchema, Schema, type} from "@colyseus/schema";
import {States} from "/imports/api/machine";
import Player from "/imports/api/rooms/schema/Player";

export class MyRoomState extends Schema {
  @type("string") gameState: States = States.Lobby;
  @type("number") timer: number = 0;
  @type("number") maxTimer: number = 0;
  @type({ map: Player }) players = new MapSchema<Player>();
  @type("string") currentPlayer: string = "";

  getCurrentPlayer() {
    return this.players.get(this.currentPlayer);
  }
}
