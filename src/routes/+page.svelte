<script lang="ts">
    import { getContext, onMount } from 'svelte';
	import type { StatusData } from './api/status/+server';
    import { writable } from 'svelte/store';
	import Card from '$lib/card.svelte';

    // const status: (() => StatusData) = getContext("status");
    const statusState = $state(
        (getContext("status") as (() => StatusData))())
    let currentTime = $state(new Date());

    let hours = $derived(currentTime.getHours());
    let minutes = $derived(currentTime.getMinutes());
    let seconds = $derived(currentTime.getSeconds());

    
    onMount(() => {
        const interval = setInterval(() => {
            currentTime = new Date();
        }, 1000);
    })
    const timeSinceUpdate = $derived(Math.floor(currentTime.valueOf()/1000 - statusState.timems/1000));
    const secToHMS = (sec: number) => {
        return {hours: Math.floor(sec/3600), minutes: Math.floor(sec/60), seconds: Math.floor(sec)}
    } 
</script>
<header class="flex flex-row w-full">
    <!-- <h1>{hours.toString().padStart(2,"0")}:{minutes.toString().padStart(2,"0")}:{seconds.toString().padStart(2,"0")}</h1> -->
    <h1 class="w-full">{currentTime.toLocaleTimeString()}</h1>
    <div class="min-w-50 text-right">
        Updated {secToHMS(timeSinceUpdate).hours > 0 ? `${secToHMS(timeSinceUpdate).hours}h` : ""}
        {secToHMS(timeSinceUpdate).minutes > 0 ? `${secToHMS(timeSinceUpdate).minutes}m` : ""}
        {secToHMS(timeSinceUpdate).seconds}s
        ago
    </div>
</header>
<main class="flex">
    <Card cardTitle="Energy Price" cardText="{statusState.energy.currentHourPrice}¢"/>
<!-- <div class="card">
    <h2>Current Energy Price</h2>
    <div class="card-text">{}¢</div>
</div> -->
</main>
