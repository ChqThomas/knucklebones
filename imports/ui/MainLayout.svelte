<script>
	import {Link} from "svelte-routing";
</script>

<div class="app h-screen flex flex-col">
    <header class="header-area">
        <div class="h-[64px] navbar fixed top-0 left-0 right-0 z-50 bg-primary shadow-lg border-none">
            <div class="navbar-start">
            </div>
            <div class="navbar-center">
                <Link to="/" class="btn btn-ghost normal-case text-xl">Knucklebones</Link>
            </div>
            <div class="navbar-end">
            </div>
        </div>
    </header>
    <main class="mt-[64px] flex flex-grow flex-col p-2">
        <slot></slot>
    </main>
</div>

<style>

    .app {
        display: grid;
        width: 100%;
        overflow: auto;
        grid-template:
          "nav" 3rem
          "main" 1fr
          / auto;
    }

    main {
        grid-area: main;
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 1fr;
    }

    main > :global(*) {
        grid-row: 1;
        grid-column: 1;
    }

</style>
