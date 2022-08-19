<script lang="ts">
  import * as _ from "lodash";

  export let col: number[];
  let score = 0;

  $: {
      score = 0;
      col.forEach(diceValue => {
          const occurences = col.filter(d => d === diceValue).length;
          score += diceValue * occurences;
      });
  }

</script>

<div class="flex items-center justify-center text-3xl">
    {score}
</div>

<style>

</style>