<script lang="ts">
  import { Client, RoomAvailable } from "colyseus.js";
  import { colyseus } from "/imports/ui/stores";
  import {onMount} from "svelte";
  import { navigate, Link } from "svelte-routing";

  let allRooms: RoomAvailable[] = [];
  let joinedRoom = null;

  $: multiplayerRooms = allRooms.filter(room => room.metadata.solo === false && (joinedRoom === null || joinedRoom.id != room.roomId));

  onMount(async () => {
    joinedRoom = null;
    const lobby = await $colyseus.joinOrCreate("lobby");

    lobby.onMessage("rooms", (rooms) => {
      allRooms = rooms;
    });

    lobby.onMessage("+", ([roomId, room]) => {
      const roomIndex = allRooms.findIndex((room) => room.roomId === roomId);
      if (roomIndex !== -1) {
        allRooms[roomIndex] = room;

      } else {
        allRooms.push(room);
      }
    });

    lobby.onMessage("-", (roomId) => {
      allRooms = allRooms.filter((room) => room.roomId !== roomId);
    });
  })

  async function createRoom(solo = false) {
    // We create the room and leave it immediately.
    joinedRoom = await $colyseus.create("game", { solo });
    await joinedRoom.leave(false);
    navigate(`game/${joinedRoom.id}`, { replace: true });
  }
</script>

<div class="w-full max-w-2xl mx-auto py-4">
  <div class="overflow-x-auto mb-4">
    <table class="table table-zebra w-full">
      <thead>
      <tr>
        <th>Name</th>
        <th>Action</th>
      </tr>
      </thead>
      <tbody>
      <!-- row 1 -->
      {#each multiplayerRooms as room}
        <tr>
          <td>{room.roomId}</td>
          <td><Link class="btn btn-secondary" to="/game/{room.roomId}">Join game</Link></td>
        </tr>
      {/each}
      </tbody>
    </table>
  </div>

  <div class="text-center">
    <button class="btn btn-primary" on:click={() => createRoom(false)}>Create game</button>
    <button class="btn btn-secondary" on:click={() => createRoom(true)}>Create solo game</button>
  </div>
</div>
