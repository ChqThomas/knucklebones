import {ArraySchema, MapSchema, Schema, type} from "@colyseus/schema";
import type {Client} from "colyseus";
import Board, {ColumnIndex} from "/imports/api/rooms/schema/Board";
import * as _ from "lodash";

export type DiceValue = 1|2|3|4|5|6;

export default class Player extends Schema {
    @type("string") id: string = "";
    @type("string") username: string = "";
    @type("boolean") connected: boolean = true;
    @type("string") opponentId: string|null = null;
    @type(Board) board: Board = new Board();
    @type("number") updateHash: number = 0;
    @type("number") dice: DiceValue = 1;
    @type("boolean") ready = false;
    @type("boolean") animateRoll = false;
    client: Client|null = null;
    isBot = false;

    async pickDice() {
        this.animateRoll = true;
        await this.animateDice();
        this.dice = this.rollDice();
        this.animateRoll = false;
    }

    rollDice(): DiceValue {
        return <DiceValue>_.random(1, 6);
    }

    async animateDice() {
        for (let i = 0; i < 15; i++) {
            this.dice = this.rollDice();
            await new Promise((resolve) => setTimeout(resolve, _.random(50, 100)));
        }
    }

    addDiceToColumn(index: ColumnIndex) {
        return this.board.addToColumn(this.dice, index);
    }

    reset() {
        this.board = new Board();
        this.ready = false;
    }
}