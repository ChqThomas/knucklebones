import {Command} from "@colyseus/command";
import Player from "/imports/api/rooms/schema/Player";
import type {MyRoom} from "/imports/api/rooms/MyRoom";
import type {ColumnIndex} from "/imports/api/rooms/schema/Board";

export type Payload = {
    player: Player,
    index: ColumnIndex
}

export class AddToBoard extends Command<MyRoom, Payload> {
    async execute({player, index}: Payload) {
        if (this.state.currentPlayer === player.id) {
            const added = player.addDiceToColumn(index);
            if (added) {
                await this.removeOpponentDices(player, index);
                player.ready = false;
                await this.room.nextTurn();
            }
        }
    }

    async removeOpponentDices(player: Player, index: ColumnIndex) {
        if (player.opponentId) {
            const opponent = this.state.players.get(player.opponentId);
            if (opponent) {
                if (opponent.board.removeDicesFromColumnInPlace(player.dice, index)) {
                    opponent.updateHash++;
                    await new Promise(resolve => setTimeout(resolve, (1000)));
                    opponent.board.sortDices(index);
                }
            }

        }
    }
}