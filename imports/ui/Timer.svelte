<script lang="ts">
  import {onMount} from "svelte";
  import { spring } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import type {MyRoom} from "/imports/api/rooms/MyRoom";

  export let room: MyRoom;

  let maxTimer = room.state.maxTimer;
  let timer = room.state.timer;
  const timerSpring = spring(timer);

  $: {
    $timerSpring = Math.ceil(timer / 1000);
  }

  onMount(() => {
    room.state.listen("timer", (newTimer: number) => {
      timer = newTimer;
    });
    room.state.listen("maxTimer", (newMaxTimer: number) => {
      maxTimer = Math.ceil(newMaxTimer / 1000);
    });
  })

</script>

<div class="w-full flex items-center flex-col h-[40px]">
  <progress class="progress progress-primary w-56 rotate-180" value="{$timerSpring}" max="{maxTimer}"></progress>
  {#if timer > 0}
    <span class="countdown font-mono text-3xl">
      <span style="--value:{(timer/1000).toFixed(0)};"></span>
    </span>
  {/if}
</div>
