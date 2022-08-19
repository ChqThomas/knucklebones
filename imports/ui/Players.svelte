<script lang="ts">
  import Player from "/imports/api/rooms/schema/Player";
  import * as _ from "lodash";

  export let currentPlayer: Player;
  export let players: Player[] = [];

  $: playersArray = _.orderBy(Array.from(players.values()), ["health", "desc"]);
</script>

<div class="text-right">
  <p>Players</p>
  <ul>
    {#each playersArray as player}
      <li class:text-primary={currentPlayer && currentPlayer.id === player.id}>{player.username} - <i class="fa fa-heart text-red-400"></i> {player.health}</li>
    {/each}
  </ul>
</div>
