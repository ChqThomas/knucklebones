<script lang="ts">
  import {fade} from "svelte/transition";

  export let value: 0|1|2|3|4|5|6;
  export let occurences = 1;

  console.log(Array(value));

</script>

{#key value === 0 ? 0 : 1}
  <div class="face occurences-{occurences}" in:fade>
    {#each Array(value) as pip}
      <span class="pip"></span>
    {/each}
  </div>
{/key}

<style>
  .face {
    display: grid;
    grid-template-areas:
		"a . c"
		"e g f"
		"d . b";

    flex: 0 0 auto;
    margin: 16px;
    padding: 10px;
    width: 104px;
    height: 104px;

    background-color: #e7e7e7;
    box-shadow: inset 0 5px white, inset 0 -5px #bbb, inset 5px 0 #d7d7d7, inset -5px 0 #d7d7d7;
    border-radius: 10%;
  }

  .face.occurences-2 {
    background-color: #cdbd6f;
    box-shadow: inset 0 5px #d5cfac, inset 0 -5px #9a8e52, inset 5px 0 #ab9d5b, inset -5px 0 #ab9d5b;
  }

  .face.occurences-3 {
    background-color: #64a1bf;
    box-shadow: inset 0 5px #9cb9c7, inset 0 -5px #38708c, inset 5px 0 #568da9, inset -5px 0 #568da9;
  }

  .pip {
    display: block;
    align-self: center;
    justify-self: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: #333;
    box-shadow: inset 0 3px #111, inset 0 -3px #555;
  }

  .pip:nth-child(2) {
    grid-area: b;
  }
  .pip:nth-child(3) {
    grid-area: c;
  }
  .pip:nth-child(4) {
    grid-area: d;
  }
  .pip:nth-child(5) {
    grid-area: e;
  }
  .pip:nth-child(6) {
    grid-area: f;
  }
  /* This selects the last pip of odd-valued dice (1, 3, 5) and positions the pip in the center */
  .pip:nth-child(odd):last-child {
    grid-area: g;
  }

</style>