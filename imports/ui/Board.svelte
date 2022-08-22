<script lang="ts">
  import Dice from "/imports/ui/Dice.svelte";
  import Board from "/imports/api/rooms/schema/Board";
  import {room, gameLoaded} from "/imports/ui/stores";
  import type {Payload} from "/imports/api/rooms/commands/addToBoard";
  import BoardScore from "/imports/ui/BoardScore.svelte";
  import {fly, scale, fade} from "svelte/transition";
  import type {DiceValue} from "/imports/api/rooms/schema/Player";

  export let board: Board;
  export let mirrored = false;
  export let ready = false;
  export let playerPlate: HTMLElement|null = null;
  export let opponentDice: DiceValue;

  $: cols = [board.col1, board.col2, board.col3];

  function addToBoard(index) {
    if (ready) {
      $room.send("addToBoard", <Payload>{
        index
      });
    }
  }

  const animationIn = (node, args) => {
    if (args.init) {
      return fade(node);
    } else {
      if (playerPlate?.querySelector(".face")) {
      } else {
        let y = 100;
        if (playerPlate?.classList.contains("opponent-plate")) {
          y = y * -1;
        }
        return fly(node, {
          delay: 0,
          y,
          opacity: 1
        });
      }
    }
  };

  const animationOut = (node, args) => {
    // if removed => scale out
    // if preceding children removed => no transition to create a translation effect
    if (args.diceValue === opponentDice) {
      return scale(node, {
        delay: 300
      });
    }
  };

</script>

<div class="flex gap-y-2">
  {#each cols as col, index}
    <div class="dice-column flex gap-2 py-1 px-1 {mirrored ? 'flex-col-reverse pt-3' : 'flex-col pb-3'}" on:click={() => addToBoard(index + 1)} class:ready>
      <BoardScore {col}/>
      {#each col as diceValue, i}
        <div class="dice-location">
          {#if diceValue}
            {#key diceValue + "_" + i}
              <div in:animationIn={{ init: !$gameLoaded }} out:animationOut={{ diceValue }}>
                <Dice value="{diceValue}" occurences="{col.filter(d => d === diceValue).length}" {playerPlate}/>
              </div>
            {/key}
          {/if}
        </div>
      {/each}
    </div>
  {/each}
</div>