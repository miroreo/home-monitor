<script lang="ts">
    import { getContext, onMount, setContext } from 'svelte';
	import type { StatusData } from './api/status/+server';
    import { writable } from 'svelte/store';
	import Card from '$lib/card.svelte';
	import Arrival from '$lib/arrival.svelte';
	import Clock from '$lib/clock.svelte';
	import type { WeatherData } from './api/weather/+server';
	import CurrentWeather from '$lib/currentWeather.svelte';
	import ElectricPrice from '$lib/ElectricPrice.svelte';

    // const status: (() => StatusData) = getContext("status");
    let statusState = $state(
        (getContext("status") as (() => StatusData))());
    let weatherState = $state(
        (getContext("weather") as (() => WeatherData))());
    onMount(() => {
        const interval = setInterval(() => {
            time = Date.now();
        }, 1000);
        const statusInterval = setInterval(() => {
            fetch("/api/status").then((resp) => {
                resp.json().then((val) => {
                    statusState = val;
                    console.log(statusState);
                });
            });
            // setContext("status", async () => await status.json());
        }, 10000)
        const weatherInterval = setInterval(() => {
            fetch("/api/weather").then((resp) => {
                resp.json().then((val) => {
                    weatherState = val as WeatherData;
                });
            });
        }, 600000)
    })
    let time = $state(Date.now());
    const timeSinceUpdate = $derived(Math.floor(time/1000 - statusState.timems/1000) || 0);
    const secToHMS = (sec: number) => {
        return {hours: Math.floor(sec/3600), minutes: Math.floor(sec/60), seconds: Math.floor(sec % 60)}
    }
    const refreshButton = () => {
        window.location.reload();
    }
</script>
<header class="flex flex-row w-full ">
    <Clock />
</header>
<main class="flex">
    <div class="">
        <ElectricPrice price={statusState?.energy?.currentHourPrice} />
    </div>
    <Card cardTitle="Transit">
        <div class="flex flex-col gap-y-0.5 h-96">
            {#each statusState.transit?.arrivals as arr}
                <Arrival arrival={arr}/>
            {/each}
        </div>
        
    </Card>
    <Card cardTitle="Weather"><CurrentWeather currentWeather={weatherState.current}/></Card>
</main>
<footer class="bottom-0 absolute right-0 p-2.5">
    <div class="align-middle flex flex-row items-center gap-x-4">
        <div class="min-w-50 text-right">
            Updated {secToHMS(timeSinceUpdate).hours > 0 ? `${secToHMS(timeSinceUpdate).hours}h` : ""}
            {secToHMS(timeSinceUpdate).minutes > 0 ? `${secToHMS(timeSinceUpdate).minutes}m` : ""}
            {secToHMS(timeSinceUpdate).seconds}s
            ago
        </div>
        <button type="button" class="rounded-full bg-gray-800 p-4 active:bg-gray-700" on:click={refreshButton}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
        </button>
    </div>
</footer>
