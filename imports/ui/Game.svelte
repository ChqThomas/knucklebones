<script lang="ts">
    import Player from "/imports/api/rooms/schema/Player";
    import Players from "./Players.svelte";
    import {player, opponent, colyseus, gameState, roomState, room} from "./stores";
    import {dndzone} from "svelte-dnd-action";
    import {onDestroy, onMount} from "svelte";
    import _ from "lodash";
    import type {JoinOptions} from "/imports/api/rooms/commands/onJoin";
    import {MyRoomState} from "/imports/api/rooms/schema/MyRoomState";
    import {States} from "/imports/api/machine";
    import {deserialize} from "serializr";
    import {navigate} from "svelte-routing";
    import Timer from "/imports/ui/Timer.svelte";
    import GameState from "/imports/ui/GameState.svelte";
    import Dice from "/imports/ui/Dice.svelte";
    import Board from "/imports/ui/Board.svelte";
    import TotalScore from "/imports/ui/TotalScore.svelte";

    export let roomId: string;
    let playerId = null;
    let opponentId = null;
    let currentPlayer: Player | null = null;
    let currentOpponent: Player | null = null;
    let playerBoard = [];
    let opponentBoard = [];
    let currentTurn = null;
    let playerTeam = [];
    let opponentTeam = [];
    let board = new Map();
    let team = new Map();
    let timer = 0;
    let roomPlayers;
    let myTurn = false;
    let opponentTurn = false;

    $: currentPlayer = playerId && $roomState && roomPlayers? roomPlayers.get(playerId) : null;
    $: currentOpponent = currentPlayer && currentPlayer.opponentId && roomPlayers ? roomPlayers.get(currentPlayer.opponentId) : null;

    $: playerBoard = currentPlayer && currentPlayer.board.toJSON();
    $: opponentBoard = currentOpponent && currentOpponent.board.toJSON();
    $: myTurn = currentPlayer ? currentTurn === currentPlayer.id : false;
    $: opponentTurn = currentOpponent ? currentTurn === currentOpponent.id : false;

    onMount(async () => {
        const joinOptions: JoinOptions = {
            username: "Chakipox" + _.random(0, 100),
        }

        let existingSessionId = localStorage.getItem(`sessionId-${roomId}`);
        if (existingSessionId) {
            try {
                $room = await $colyseus.reconnect<MyRoomState>(roomId, existingSessionId);
                playerId = existingSessionId;
            } catch (e) {
                console.error("reconnect error", e);
            }
        }

        if ($room === null) {
            try {
                $room = await $colyseus.joinById<MyRoomState>(roomId, joinOptions);
            } catch {
                navigate("/");
                return;
            }
        }

        $room.state.listen("gameState", (newGameState: States) => {
            $gameState = newGameState;
        });

        $room.state.listen("currentPlayer", (newCurrentPlayer: string) => {
            currentTurn = newCurrentPlayer;
        });


        // Initial state;
        $room.onStateChange.once((state) => {
            $roomState = state;
        });

        $room.state.players.onChange = (player, key) => {
            console.log(player, "have changes at", key);
        };

        $room.state.players.onAdd = (player, key) => {
            console.log("add player", key);
            if (player.id === playerId) {
                console.log("player connected", player);
            }

            player.onChange = () => {
                console.log("player.onChange");
                roomPlayers = $room.state.players;
            }

            roomPlayers = $room.state.players;
        };

        $room.state.players.onRemove = (player, key) => {
            console.log("remove player", key);
            roomPlayers = $room.state.players;
        };

        $room.onMessage("connected", ({ sessionId }) => {
            playerId = sessionId;
            localStorage.setItem(`sessionId-${roomId}`, sessionId);

            console.log("connected", sessionId);
        });
    })

    function newRound() {
        $room.send("newRound");
    }

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms ?? 200));
    }

    async function attack() {
        $room?.send("fight");
    }

    async function startGame() {
        $room?.send("startGame");
    }

    async function endGame() {
        $room?.send("endGame");
    }

    onDestroy(() => {
        $room?.leave(false);
        $room = null;
    })

</script>

{#if $room && $roomState && currentPlayer}
    <div class="w-full h-[50px]">
        <button class="btn-custom" on:click={() => startGame()}>Start game</button>
        <!-- <button class="btn-custom" on:click={() => endGame()}>End game</button>
        <button class="btn-custom" on:click={() => newRound()}>New round</button>
        <button class="btn-custom" on:click={() => attack()}>Attaque</button>-->
    </div>
    <div class="flex">
        <div>
            <Dice value="{myTurn ? currentPlayer.dice : 0}"/>
            <TotalScore board="{playerBoard}"/>
        </div>
        <div class="flex flex-col flex-grow">


            <!-- <Timer room="{$room}"/>
            <GameState {currentOpponent}/>--->



            <!-- <div class="flex mb-3">
                <div>
                </div>
                <div class="flex-grow"></div>
                <Players players="{roomPlayers}" {currentPlayer}/>
            </div>--->



            <div class="flex items-center justify-center flex-col gap-4">
                {#if opponentBoard}
                    <Board board="{opponentBoard}" mirrored="{true}"/>
                {/if}
                {#if playerBoard}
                    <Board board="{playerBoard}"/>
                {/if}
            </div>
        </div>
        <div>
            {#if currentOpponent}
                <Dice value="{opponentTurn ? currentOpponent.dice : 0}"/>
                <TotalScore board="{opponentBoard}"/>
            {/if}
        </div>
    </div>

{/if}