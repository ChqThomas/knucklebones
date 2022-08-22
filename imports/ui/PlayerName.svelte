<script lang="ts">
  export let username: string;
</script>

<div class="player-name flex items-center justify-center w-full gap-4">
    <div class="flex-grow player-decoration border-primary"></div>
    {username}
    <div class="flex-grow player-decoration border-primary"></div>
</div>

<style>
    .player-decoration {
        border-width: 1px;
        border-style: solid;
        max-width: 75px;
    }
</style>