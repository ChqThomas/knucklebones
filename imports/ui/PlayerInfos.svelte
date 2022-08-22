<script lang="ts">
  import PlayerName from "/imports/ui/PlayerName.svelte";
  import TotalScore from "/imports/ui/TotalScore.svelte";
  import Player from "/imports/api/rooms/schema/Player";
  import Board from "/imports/api/rooms/schema/Board";

  export let player:Player;
  export let board:Board;
  export let reversed = false;
</script>

<div class="grow-[2] centered {reversed ? 'flex-col-reverse' : 'flex-col'}">
    <div class="grow-[2]"></div>
    <div class="grow centered w-full flex-col">
        <PlayerName username="{player.username}"/>
        <TotalScore board="{board}"/>
    </div>
</div>