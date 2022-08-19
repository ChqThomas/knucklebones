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
        const filteredColumn = this[`col${index}`].filter(d => d !== diceValue);
        this[`col${index}`] = Object.assign(new Array(3).fill(0), filteredColumn);
    }

    getAllValues() {
        return [...this.col1.values(), ...this.col2.values(), ...this.col3.values()]
    }

    isFull() {
        return !this.getAllValues().some(d => d === 0);
    }

    getColAsArray(index: ColumnIndex) {
        return [...this[`col${index}`].values()];
    }

    getColumnIndexes(): ColumnIndex[] {
        return [1, 2, 3];
    }

    getAvailableColumns(): ColumnIndex[] {
        const available = [];
        [1, 2, 3].forEach((index: ColumnIndex) => {
            if (this.getColAsArray(index).some(d => d === 0)) {
                available.push(index);
            }
        })
        return available;
    }

    getColContainingValue(value: DiceValue, available = false): ColumnIndex|null {
        let colIndex = null;
        const cols = available ? this.getAvailableColumns() : this.getColumnIndexes();
        cols.forEach((index) => {
            if (this.getColAsArray(index).some(d => d === value)) {
                colIndex = index;
            }
        });
        return colIndex;
    }
}
        