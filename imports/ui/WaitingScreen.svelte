<script lang="ts">
    let copied = false;

    function copyUrl() {
        navigator.clipboard.writeText(window.location.href);
        copied = true;
    }
</script>

<div class="centered flex-col gap-4 flex-grow">
    Waiting for opponent ...
    <div class="form-control w-full">
        <div class="input-group w-full centered">
            <input type="text" placeholder="Type here" class="input input-bordered input-info w-full max-w-xl"
                   value="{window.location}"/>
            <button class="btn" on:click|preventDefault={copyUrl}>
                {#if copied}
                    Copied!
                {:else}
                    Copy invitation link
                {/if}
            </button>
        </div>
    </div>
</div>