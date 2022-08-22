import type {Client} from "colyseus";
import {Room} from "colyseus";
import {MyRoomState} from "./schema/MyRoomState";
import {States} from "/imports/api/machine";
import {Dispatcher} from "@colyseus/command";
import * as _ from "lodash";

import type {JoinOptions} from "./commands/onJoin";

// Commands
import {OnJoinCommand} from "/imports/api/rooms/commands/onJoin";
import {addBot, playTurn} from "/imports/api/botGenerator";
import {AddToBoard} from "/imports/api/rooms/commands/addToBoard";
import {getWinner} from "/imports/api/scoring";

type CreateOptions = {
  solo: boolean
}

export class MyRoom extends Room<MyRoomState> {

  LOBBY_CHANNEL = "$mylobbyChannel"
  dispatcher = new Dispatcher(this);
  maxClients = 2;

  async onCreate (options: CreateOptions) {
    this.roomId = await this.generateRoomId();
    await this.setMetadata({ ...options });
    this.setState(new MyRoomState());

    if (options.solo) {
      addBot(this);
      this.state.gameState = States.Play;
    } else {
      this.state.gameState = States.Waiting;
    }

    this.registerMessages();

    console.log("room created", this.state);
  }

  async onJoin (client: Client, options: JoinOptions) {
    this.dispatcher.dispatch(new OnJoinCommand(), {
      client,
      options
    });
  }

  async onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");

    const player = this.getPlayer(client);
    if (player) {
      // flag client as inactive for other users
      player.connected = false;

      try {
        if (consented) {
          throw new Error("consented leave");
        }

        // allow disconnected client to reconnect into this room until 20 seconds
        await this.allowReconnection(client, 20);

        // client returned! let's re-activate it.
        player.connected = true;

        console.log(client.sessionId, "reconnected!");

      } catch (e) {

        // 20 seconds expired. let's remove the client.
        this.state.players.delete(client.sessionId);
      }
    } else {
      await this.allowReconnection(client, 3);
    }

  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
    this.presence.srem(this.LOBBY_CHANNEL, this.roomId);
  }

  getPlayer(client: Client) {
    return this.state.players.get(client.sessionId);
  }

  // Generate a single 4 capital letter room ID.
  generateRoomIdSingle(): string {
    const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = '';
    for (var i = 0; i < 4; i++) {
      result += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
    }
    return result;
  }

  // 1. Get room IDs already registered with the Presence API.
  // 2. Generate room IDs until you generate one that is not already used.
  // 3. Register the new room ID with the Presence API.
  async generateRoomId(): Promise<string> {
    const currentIds = await this.presence.smembers(this.LOBBY_CHANNEL);
    let id;
    do {
      id = this.generateRoomIdSingle();
    } while (currentIds.includes(id));

    await this.presence.sadd(this.LOBBY_CHANNEL, id);
    return id;
  }

  async waitTimer(delay: number) {
    const startTime = this.clock.currentTime;
    const delayedInterval = this.clock.setInterval(() => {
      this.state.timer = delay - (this.clock.currentTime - startTime);
    }, 200);
    this.state.maxTimer = delay;
    return new Promise(resolve => {
      this.clock.setTimeout(async () => {
        delayedInterval.clear();
        this.state.timer = 0;
        resolve(true);
      }, delay);
    })
  }

  // The game is ended if one of the players board is full
  isGameEnded() {
    return this.getPlayersArray().some(p => p.board.isFull());
  }

  handleGameEnd() {
    let winner = getWinner(this.getPlayersArray());
    this.state.winner = winner.id;
    this.state.gameState = States.End;
  }

  getPlayersArray() {
    return [...this.state.players.values()];
  }

  async nextTurn() {

    if (this.isGameEnded()) {
        return this.handleGameEnd();
    }

    if (this.state.currentPlayer === "") {
      let randPlayer = _.sample(this.getPlayersArray());
      if (randPlayer) {
        this.state.currentPlayer = randPlayer.id;
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.state.currentPlayer = this.state.currentPlayer === this.getPlayersArray()[0].id ? this.getPlayersArray()[1].id : this.getPlayersArray()[0].id;
    }

    const currentPlayer = this.state.getCurrentPlayer();
    if (currentPlayer) {
      await currentPlayer.pickDice();
      currentPlayer.ready = true;
      if (currentPlayer.isBot) {
        await playTurn(this, currentPlayer);
      }
    }
  }

  async startGame() {
    this.state.players.forEach(p => {
      p.reset();
    });
    this.state.currentPlayer = "";
    this.state.winner = "";
    this.state.gameState = States.Play;
    await this.nextTurn();
  }

  registerMessages() {
    this.onMessage("*", (client, key, value) => {
      const player = this.state.players.get(client.sessionId);

      if (!player) {
        return;
      }

      switch (key) {
        case "addToBoard":
          this.dispatcher.dispatch(new AddToBoard(), {
            player,
            index: value.index
          });
          break
        case "playAgain":
          if (this.state.gameState === States.End) {
            this.startGame();
          }
          break
      }

    });
  }



}
