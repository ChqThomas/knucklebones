<script lang="ts">
  import { Router, Link, Route } from 'svelte-routing'
  import MainLayout from './MainLayout.svelte'
  import Game from "/imports/ui/Game.svelte";
  import Lobby from "/imports/ui/Lobby.svelte";
  import RouteTransition from "/imports/ui/RouteTransition.svelte";

  export let loadableHandle = {}
  export let url = ''
</script>

<Router url="{url}">
  <MainLayout>
    <Route path="/">
      <RouteTransition>
        <Lobby/>
      </RouteTransition>
    </Route>
    <Route path="/game/:roomId" let:params>
      <RouteTransition>
        <Game roomId="{params.roomId}"/>
      </RouteTransition>
    </Route>
  </MainLayout>
</Router>
