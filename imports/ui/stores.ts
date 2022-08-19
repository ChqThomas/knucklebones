import {writable, get, type Updater, Readable, readable} from "svelte/store";
import type { Writable } from "svelte/store";
import Player from "/imports/api/rooms/schema/Player";
import { Client } from "colyseus.js";
import {States} from "/imports/api/machine";
import {MyRoomState} from "/imports/api/rooms/schema/MyRoomState";
import {Room} from "colyseus.js/dist/colyseus";
import { Meteor } from 'meteor/meteor'

export const colyseus: Readable<Client> = readable(new Client(Meteor.settings.public.WS_URL));

abstract class ReactiveStore<T> {
    public value: Writable<T>;
    public initialValue: T;
    public update: (this: void, updater: Updater<T>) => void;
    public subscribe: (this: void, updater: Updater<T>) => void;
    public set: (this: void, value: T) => void;

    constructor(t: T) {
        this.value = writable(t);
        this.initialValue = t;
        this.update = this.value.update;
        this.subscribe = this.value.subscribe;
        this.set = this.value.set;
    }

    get(): T {
        return get(this.value);
    }

    refresh() {
        this.set(get(this.value));
    }

    reset() {
        this.value.set(this.initialValue);
    }
}

export class PlayerStore extends ReactiveStore<Player>{

}

export let player = new PlayerStore(new Player("Player"));
export let opponent = new PlayerStore(new Player("Opponent"));
export let gameState: Writable<States> = writable(States.Lobby);
export let roomState: Writable<MyRoomState> = writable();
export let room: Writable<Room<MyRoomState>> = writable(null);