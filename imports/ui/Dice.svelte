<script lang="ts">
  import {fly, scale} from "svelte/transition";
  import {playerDiceAdded} from "/imports/ui/stores";

  export let value: 0|1|2|3|4|5|6;
  export let occurences = 1;
  export let animate = true;
  export let playerPlate: HTMLElement|null = null;
  let el;

  // Animate from player to position in board
  const animationIn = (node, args) => {
    if (args.animate && playerPlate) {
      let playerDice = <HTMLElement> playerPlate.querySelector(".face");
      if (playerDice) {
        const dx = playerDice.getBoundingClientRect().left - el.getBoundingClientRect().left;
        const dy = playerDice.getBoundingClientRect().top - el.getBoundingClientRect().top;
        $playerDiceAdded = true;
        return fly(node, {
          x: dx,
          y: dy,
          opacity: 1
        });
      }
    }
  };

</script>

{#key value === 0 ? 0 : 1}
  <div bind:this={el} style={$$props.style} class="face occurences-{occurences}" in:animationIn={{ animate }}>
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
    width: 70px;
    height: 70px;

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
    width: 14px;
    height: 14px;
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