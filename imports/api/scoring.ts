import Player, {DiceValue} from "/imports/api/rooms/schema/Player";
import * as _ from "lodash";
import Board from "/imports/api/rooms/schema/Board";

export function getColumnScore(values: DiceValue[]) {
    let score = 0;
    values.forEach(diceValue => {
        const occurences = values.filter(d => d === diceValue).length;
        score += diceValue * occurences;
    });
    return score;
}

export function getTotalScore(board: Board) {
    return _.sum([
        [...board.col1.values()],
        [...board.col2.values()],
        [...board.col3.values()]
    ].map(getColumnScore));
}

// return the player with the highest score
// in case of draw, return the player who completed the board
export function getWinner(players: Player[]): Player {
    let winner = null;
    let winnerScore = null;
    players.forEach(player => {
        let score = getTotalScore(player.board);
        if (score > winnerScore || winnerScore === null) {
            winnerScore = score;
            winner = player;
        } else if (score === winnerScore) {
            if (player.board.getAvailableColumns().length === 0) {
                winner = player;
            }
        }
    });
    return winner;
}