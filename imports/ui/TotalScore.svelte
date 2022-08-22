<script lang="ts">
  import Board from "/imports/api/rooms/schema/Board";
  import {tweened} from "svelte/motion";
  import {getTotalScore} from "/imports/api/scoring";

  export let board: Board;
  let score = 0;
  let previousScore = score;

  let animation = tweened(0, {
      duration: 70,
  });

  $: {
      score = getTotalScore(board);
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

<div class="flex items-center justify-center text-3xl" style="transform: translateX({$animation}px)">
    {score}
</div>

<style>

</style>