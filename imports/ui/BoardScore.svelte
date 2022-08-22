<script lang="ts">
  import * as _ from "lodash";
  import {tweened} from "svelte/motion";
  import {getColumnScore} from "/imports/api/scoring";
  import type {DiceValue} from "/imports/api/rooms/schema/Player";

  export let col: DiceValue[];
  let score = 0;
  let previousScore = score;

  let animation = tweened(0, {
      duration: 70,
  });

  $: {
      score = getColumnScore(col);
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