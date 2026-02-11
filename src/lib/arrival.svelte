<script lang="ts">
    import type { Snippet } from 'svelte';
	import type { Arrival } from './cta';

    interface Props {
		arrival: Arrival;
	}
    let { arrival }: Props = $props();
    function minutesUntil(arrival: Date) {
        const now = new Date();
        const diff = arrival.getTime() - Date.now();
        return Math.ceil(diff / 60000);
    }
    const minsUntil = $derived(minutesUntil(new Date(arrival.arrivalTime)));

</script>
<div class="flex flex-row arrivalCard min-w-75" data-destination="{arrival.destination}" data-line="{arrival.route.toString()}" class:italic={arrival.isScheduled}>
    <div class="w-full flex flex-col gap-0">
        <div class="align-middle text-xl">
            {arrival.destination}
        </div>
    </div>
    
    <div class="w-fit text-nowrap text-xl flex flex-row align-middle">
        {#if minsUntil <= 1 || arrival.isApproaching}
            Due
        {:else}
            {minsUntil} min
        {/if}
        {#if !arrival.isScheduled}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12.75 19.5v-.75a7.5 7.5 0 0 0-7.5-7.5H4.5m0-6.75h.75c7.87 0 14.25 6.38 14.25 14.25v.75M6 18.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
</svg>
        {:else}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
        {/if}
    </div>
</div>

<style>
    @import 'tailwindcss';
    .arrivalCard {
        @apply  p-1 flex flex-row min-w-75 font-bold;
        font-family: Helvetica, Arial, sans-serif;
    }
    .arrivalCard[data-line="Green"]:not([data-destination="Cottage Grove"]) {
        background-color: #009b3a;
        color: white;
    }
    .arrivalCard[data-line="Green"][data-destination="Cottage Grove"] {
        background-color: #ffffff;
        color: #009b3a;
    }
    .arrivalCard[data-line="Blue"]:not([data-destination="UIC-Halsted"]) {
        background-color: #00a1de;
        color: white;
    }
    .arrivalCard[data-line="Blue"][data-destination="UIC-Halsted"] {
        background-color: #ffffff;
        color: #00a1de;
    }
    .arrivalCard[data-line="Red"] {
        background-color: #c60c30;
        color: white;
    }
    .arrivalCard[data-line="Orange"] {
        background-color: #f9461c;
        color: white;
    }
    .arrivalCard[data-line="Yellow"] {
        background-color: #f9e300;
        color: black;
    }
    .arrivalCard[data-line="Purple"] {
        background-color: #522398;
        color: white;
    }
    .arrivalCard[data-line="Brown"] {
        background-color: #62361b;
        color: white;
    }
    .arrivalCard[data-line="Pink"] {
        background-color: #e27ea6;
        color: white;
    }
    .arrivalCard[data-line="Bus"] {
        background-color: #565a5c;
        color: white
    }
</style>