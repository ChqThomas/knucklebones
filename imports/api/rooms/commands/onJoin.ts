import {Command} from "@colyseus/command";
import Player from "/imports/api/rooms/schema/Player";
import type {MyRoom} from "/imports/api/rooms/MyRoom";
import type {Client} from "colyseus";

export type JoinOptions = {
    username: string;
}

export type Payload = {
    client: Client,
    options: JoinOptions
}

export class OnJoinCommand extends Command<MyRoom, Payload> {

    async execute({client, options}: Payload) {
        console.log(client.sessionId, "joined!");
        if (options.username) {
            let player = new Player();
            player.id = client.sessionId;
            player.username = options.username;
            player.client = client;

            client.send("connected", { sessionId: client.sessionId });

            await new Promise((resolve) => setTimeout(resolve, 100));

            this.state.players.set(client.sessionId, player);

            if (this.state.players.size === 2) {
                const opponent = this.room.getPlayersArray().filter(p => p.id !== player.id)[0];
                player.opponentId = opponent.id;
                opponent.opponentId = player.id;
                this.room.nextTurn();
            }
        }
    }

}