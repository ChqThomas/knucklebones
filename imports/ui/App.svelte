<script lang="ts">
  import { Router, Link, Route } from 'svelte-routing'
  import MainLayout from './MainLayout.svelte'
  import Game from "/imports/ui/Game.svelte";
  import Lobby from "/imports/ui/Lobby.svelte";

  export let loadableHandle = {}
  export let url = ''
</script>

<Router url="{url}">
  <MainLayout>
    <Route path="/">
      <Lobby/>
    </Route>
    <Route path="/game/:roomId" let:params>
      <Game roomId="{params.roomId}"/>
    </Route>
  </MainLayout>
</Router>
