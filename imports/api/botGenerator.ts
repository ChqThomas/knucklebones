import type {MyRoom} from "/imports/api/rooms/MyRoom";
import Player from "/imports/api/rooms/schema/Player";
import {AddToBoard} from "/imports/api/rooms/commands/addToBoard";
import type {ColumnIndex} from "/imports/api/rooms/schema/Board";
import * as _ from "lodash";

export function addBot(room: MyRoom) {
    let player = new Player();
    player.id = "bot-0" + (room.state.players.size + 1);
    player.username = player.id;
    player.isBot = true;
    room.state.players.set(player.id, player);
}

export async function playTurn(room: MyRoom, player: Player) {
    await wait(1000);

    let colIndex = player.board.getColContainingValue(player.dice, true);
    if (colIndex === null) {
        const availableColumns = player.board.getAvailableColumns();

        const opponent = room.state.players.get(<string> player.opponentId);
        if (opponent) {
            const opponentColIndex = opponent.board.getColContainingValue(player.dice);
            if (availableColumns.includes(opponentColIndex)) {
                colIndex = opponentColIndex;
            }
        }

        if (colIndex === null) {
            colIndex = <ColumnIndex>_.sample(availableColumns);
        }
    }

    room.dispatcher.dispatch(new AddToBoard(), {
        player,
        index: colIndex
    });
}

async function wait(delay: number) {
    return new Promise(resolve => setTimeout(resolve, delay));
}