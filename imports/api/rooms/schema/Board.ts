import {ArraySchema, Schema, type} from "@colyseus/schema";
import type {DiceValue} from "/imports/api/rooms/schema/Player";
import * as _ from "lodash";

export type ColumnIndex = 1|2|3;

export default class Board extends Schema {
    @type(["number"]) col1 = new ArraySchema<number>(0, 0, 0);
    @type(["number"]) col2 = new ArraySchema<number>(0, 0, 0);
    @type(["number"]) col3 = new ArraySchema<number>(0, 0, 0);

    addToColumn(dice: DiceValue, index: ColumnIndex): boolean {
        const emptyCol = this[`col${index}`].filter(d => d !== 0);
        if (emptyCol.length < 3) {
            this[`col${index}`][emptyCol.length] = dice;
            return true;
        }
        return false
    }

    removeDicesFromColumn(diceValue: DiceValue, index: ColumnIndex) {
        console.log("remove ", diceValue, index);
        const filteredColumn = this[`col${index}`].filter(d => d !== diceValue);
        console.log(filteredColumn);
        this[`col${index}`] = Object.assign(new Array(3).fill(0), filteredColumn);
        console.log(this[`col${index}`]);
    }
}
        