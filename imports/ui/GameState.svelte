<script lang="ts">
    import {gameState} from "/imports/ui/stores";
    import {States} from "/imports/api/machine";
    import type Player from "/imports/api/rooms/schema/Player";

    export let currentOpponent: Player | null = null;
</script>

<div class="w-full flex items-center flex-col h-[40px]">
    {#if $gameState === States.Waiting}
        En attente du début de la partie
    {:else if $gameState === States.Preparation}
        Phase de préparation
    {:else if $gameState === States.Play}
        {#if currentOpponent}
            VS {currentOpponent.username}
        {:else}
            Phase de combat
        {/if}
    {:else if $gameState === States.End}
        Fin de la partie
    {/if}
</div>