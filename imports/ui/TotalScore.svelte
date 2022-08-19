<script lang="ts">
  import Board from "/imports/api/rooms/schema/Board";
  import {tweened} from "svelte/motion";

  export let board: Board;
  let score = 0;
  let previousScore = score;

  let animation = tweened(0, {
      duration: 70,
  });

  $: cols = [board.col1, board.col2, board.col3];

  $: {
      score = 0;

      cols.forEach(col => {
          col.forEach(diceValue => {
              const occurences = col.filter(d => d === diceValue).length;
              score += diceValue * occurences;
          });
      })

      if (score !== previousScore) {
          animateScore();
      }
      previousScore = score;
  }

  async function animateScore() {
      await animation.set(-6);
      await animation.set(6);
      await animation.set(-6);
      await animation.set(6);
      await animation.set(0);
  }

</script>

<div class="flex items-center justify-center text-3xl" style="margin-left:{$animation}px">
    {score}
</div>

<style>

</style>