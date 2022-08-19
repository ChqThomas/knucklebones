import type {MyRoom} from "/imports/api/rooms/MyRoom";
import Player from "/imports/api/rooms/schema/Player";

export function addBot(room: MyRoom) {
    let player = new Player();
    player.id = "bot-0" + (room.state.players.size + 1);
    player.username = player.id;
    room.state.players.set(player.id, player);
}