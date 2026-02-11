<script lang="ts">
    import type { Snippet } from 'svelte';
	import type { Arrival, BusArrival } from './cta';

    interface Props {
		arrival: BusArrival;
	}
    let { arrival }: Props = $props();
    function minutesUntil(arrival: Date) {
        const now = new Date();
        const diff = arrival.getTime() - Date.now();
        return Math.ceil(diff / 60000);
    }
    const minsUntil = $derived(minutesUntil(new Date(arrival.predictedTime)));

</script>
<div class="flex flex-row arrivalCard min-w-75" data-destination="{arrival.destination}" data-line="{arrival.route.toString()}" class:italic={arrival.isScheduled}>
    <div class="w-full flex flex-col gap-0">
        <div class="align-middle text-xl">
            {arrival.route}{arrival.destination}
        </div>
    </div>
    
    <div class="w-fit text-nowrap text-xl flex flex-row align-middle">
        {#if minsUntil <= 1}
            Due
        {:else}
            {minsUntil} min
        {/if}
    </div>
</div>

<style>
    @import 'tailwindcss';
    .arrivalCard {
        @apply  p-1 flex flex-row min-w-75 font-bold;
        font-family: Helvetica, Arial, sans-serif;
    }
    .arrivalCard{
        background-color: #565a5c;
        color: white
    }
</style>
