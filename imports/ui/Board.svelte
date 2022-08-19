<script lang="ts">
  import Dice from "/imports/ui/Dice.svelte";
  import Board from "/imports/api/rooms/schema/Board";
  import {room} from "/imports/ui/stores";
  import type {Payload} from "/imports/api/rooms/commands/addToBoard";
  import BoardScore from "/imports/ui/BoardScore.svelte";

  export let board: Board;
  export let mirrored = false;

  $: flattenedBoard = [...board.col1, ...board.col2, ...board.col3];

  function addToBoard(index) {
    $room.send("addToBoard", <Payload>{
      index
    });
  }

</script>

<div class="grid gap-4" class:mirrored>
  {#each flattenedBoard as diceValue, index}
    <div class="dice-location" on:click={() => addToBoard(Math.ceil((index + 1) / 3))} data-index="{index}">
      {#if diceValue}
        <Dice value="{diceValue}"/>
      {/if}
    </div>
  {/each}
  <BoardScore col="{board.col1}"/>
  <BoardScore col="{board.col2}"/>
  <BoardScore col="{board.col3}"/>
</div>

<style>
  .grid {
    grid-template-areas:
        "x y z"
		"a d g"
		"b e h"
		"c f i";
  }

  .grid.mirrored {
    grid-template-areas:
		"c f i"
		"b e h"
		"a d g"
        "x y z";
  }

  .dice-location:nth-child(1) {
    grid-area: a;
  }
  .dice-location:nth-child(2) {
    grid-area: b;
  }
  .dice-location:nth-child(3) {
    grid-area: c;
  }

  .dice-location:nth-child(4) {
    grid-area: d;
  }
  .dice-location:nth-child(5) {
    grid-area: e;
  }
  .dice-location:nth-child(6) {
    grid-area: f;
  }

  .dice-location:nth-child(7) {
    grid-area: g;
  }
  .dice-location:nth-child(8) {
    grid-area: h;
  }
  .dice-location:nth-child(9) {
    grid-area: i;
  }

  .dice-location:nth-child(10) {
    grid-area: x;
  }
  .dice-location:nth-child(11) {
    grid-area: y;
  }
  .dice-location:nth-child(12) {
    grid-area: z;
  }
</style>