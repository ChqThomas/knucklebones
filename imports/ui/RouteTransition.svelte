<script lang="ts">
    import {fade} from "svelte/transition";
</script>

<div transition:fade class="flex flex-grow flex-col">
    <slot/>
</div>