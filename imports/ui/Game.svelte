<script lang="ts">
    import _ from "lodash";
    import {onDestroy, onMount} from "svelte";
    import {fade} from "svelte/transition";
    import {navigate} from "svelte-routing";
    import {tweened} from "svelte/motion";
    import {bounceOut} from "svelte/easing";

    // TYPES
    import type {JoinOptions} from "/imports/api/rooms/commands/onJoin";
    import {MyRoomState} from "/imports/api/rooms/schema/MyRoomState";
    import Player from "/imports/api/rooms/schema/Player";
    import {States} from "/imports/api/machine";

    // STORES
    import {colyseus, gameLoaded, gameState, playerDiceAdded, room, roomState} from "./stores";

    // COMPONENTS
    import {Confetti} from "svelte-confetti"
    import Dice from "/imports/ui/Dice.svelte";
    import Board from "/imports/ui/Board.svelte";
    import PlayerInfos from "/imports/ui/PlayerInfos.svelte";
    import WaitingScreen from "/imports/ui/WaitingScreen.svelte";


    // PROPS
    export let roomId: string;

    // LOCAL VARS
    let playerId = null;
    let opponentId = null;
    let currentPlayer: Player | null = null;
    let currentOpponent: Player | null = null;
    let playerBoard: any = [];
    let opponentBoard: any = [];
    let currentTurn = null;
    let board = new Map();
    let timer = 0;
    let roomPlayers;
    let myTurn = false;
    let opponentTurn = false;
    let ready = false;
    let winnerId = null;
    let animateRoll = tweened(0, { duration: 1500, easing: bounceOut });
    let animateRollOpponent = tweened(0, { duration: 1500, easing: bounceOut });
    let playerPlate: HTMLElement;
    let opponentPlate: HTMLElement;
    let playerDiceEL: HTMLElement;

    // REACTIVE STATEMENTS
    $: currentPlayer = playerId && $roomState && roomPlayers? roomPlayers.get(playerId) : null;
    $: currentOpponent = currentPlayer && currentPlayer.opponentId && roomPlayers ? roomPlayers.get(currentPlayer.opponentId) : null;
    $: winner = winnerId && roomPlayers ? roomPlayers.get(winnerId) : null;

    $: playerBoard = currentPlayer && currentPlayer.board.toJSON();
    $: opponentBoard = currentOpponent && currentOpponent.board.toJSON();
    $: myTurn = currentPlayer ? currentTurn === currentPlayer.id : false;
    $: opponentTurn = currentOpponent ? currentTurn === currentOpponent.id : false;

    onMount(async () => {

        $gameLoaded = false;
        $gameState = States.Created;

        const joinOptions: JoinOptions = {
            username: "Player",
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

        // @ts-ignore
        $room.state.listen("gameState", (newGameState: States) => {
            $gameState = newGameState;
        });

        // @ts-ignore
        $room.state.listen("currentPlayer", (newCurrentPlayer: string) => {
            currentTurn = newCurrentPlayer;
            $playerDiceAdded = false;
        });

        // @ts-ignore
        $room.state.listen("winner", (newWinner: string) => {
            winnerId = newWinner;
        });

        // Initial state;
        $room.onStateChange.once((state) => {
            $roomState = state;
            setTimeout(() => {
                $gameLoaded = true;
            }, 500);
        });

        $room.state.players.onAdd = (player, key) => {
            if (player.id === playerId) {
                console.log("player connected", player);

                // @ts-ignore
                player.listen("animateRoll", (startAnimate) => {
                    if (startAnimate && playerPlate) {
                        let middle = playerPlate.getBoundingClientRect().width / 2 - 35;
                        animateRoll.set(_.random(middle - 50, middle + 50));
                    }
                });
            } else {
                // @ts-ignore
                player.listen("animateRoll", (startAnimate) => {
                    if (startAnimate && opponentPlate) {
                        let middle = opponentPlate.getBoundingClientRect().width / 2 - 35;
                        animateRollOpponent.set(_.random(middle - 50, middle + 50));
                    }
                });
            }

            player.onChange = () => {
                roomPlayers = $room.state.players;
            }

            roomPlayers = $room.state.players;
        };

        $room.state.players.onRemove = (player, key) => {
            roomPlayers = $room.state.players;
        };

        $room.onMessage("connected", ({ sessionId }) => {
            playerId = sessionId;
            localStorage.setItem(`sessionId-${roomId}`, sessionId);
        });
    })

    function playAgain() {
        $room.send("playAgain");
    }

    onDestroy(() => {
        $room?.leave(false);
        $room = null;
    })

</script>

{#if $room && $roomState && currentPlayer && currentOpponent && [States.End, States.Play].includes($gameState)}
    <div class="flex flex-grow">
        <div class="flex flex-col flex-grow">
            <PlayerInfos player="{currentPlayer}" board="{playerBoard}"/>
            <div class="grow-[1] flex flex-col items-center justify-center">
                <div bind:this={playerPlate} class="plate flex flex-col items-center justify-center relative border-primary" >
                    {#if myTurn && !$playerDiceAdded}
                        <Dice value="{currentPlayer.dice}" style="position: absolute; left: {$animateRoll}px; top: 0px" animate="{false}"/>
                    {/if}
                </div>
            </div>
        </div>
        <div class="flex flex-col h-full">
            <div class="flex flex-grow items-center justify-center flex-col gap-4">
                {#if opponentBoard}
                    <Board board="{opponentBoard}" mirrored="{true}" playerPlate="{opponentPlate}" opponentDice="{currentPlayer.dice}"/>
                {/if}
                {#key winner}
                    <div class="flex flex-col items-center justify-center flex-grow" in:fade>
                        {#if winner}
                            <Confetti x={[-1.5, -0.5]} y={[0.25, -0.25]} />
                            <Confetti x={[0.5, 1.5]} y={[0.25, -0.25]} />
                            <Confetti cone amount=80 x={[-1, 1]} y={[0.2, 0.8]} delay={[500, 550]} />
                            <div class="mb-2">The winner is <span class="font-bold">{winner.username}</span></div>
                            <div class="btn btn-secondary" on:click|preventDefault={() => playAgain()}>Play again</div>
                        {/if}
                    </div>
                {/key}
                {#if playerBoard}
                    <div class="mb-6">
                        <Board board="{playerBoard}" ready="{currentPlayer.ready}" {playerPlate} opponentDice="{currentOpponent.dice}"/>
                    </div>
                {/if}
            </div>
        </div>
        <div class="flex flex-col flex-grow">
            {#if currentOpponent}
                <div class="grow-[1] flex flex-col items-center justify-center">
                    <div bind:this={opponentPlate} class="plate opponent-plate flex flex-col items-center justify-center relative border-primary">
                        {#if opponentTurn && !$playerDiceAdded}
                            <Dice value="{opponentTurn ? currentOpponent.dice : 0}" style="position: absolute; left: {$animateRollOpponent}px; top: 0px" animate="{false}"/>
                        {/if}
                    </div>
                </div>
                <PlayerInfos player="{currentOpponent}" board="{opponentBoard}" reversed="{true}"/>
            {/if}
        </div>
    </div>
{:else if $gameState === States.Waiting}
    <WaitingScreen/>
{/if}

<style>
    .plate {
        background: hsl(var(--p) / 0.3);
        border-radius: 12px;
        border-style: solid;
        border-width: 1px;
        padding: 10px;
        width: 50%;
        height: 100px;
    }
</style>