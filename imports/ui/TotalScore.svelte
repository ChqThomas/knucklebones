<script lang="ts">
  import Board from "/imports/api/rooms/schema/Board";

  export let board: Board;
  let score = 0;

  $: {
      score = 0;

      board.col1.forEach(diceValue => {
          const occurences = board.col1.filter(d => d === diceValue).length;
          score += diceValue * occurences;
      });

      board.col2.forEach(diceValue => {
          const occurences = board.col2.filter(d => d === diceValue).length;
          score += diceValue * occurences;
      });

      board.col3.forEach(diceValue => {
          const occurences = board.col3.filter(d => d === diceValue).length;
          score += diceValue * occurences;
      });
  }

</script>

<div class="flex items-center justify-center text-3xl">
    {score}
</div>

<style>

</style>