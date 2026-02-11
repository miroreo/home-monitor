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
<div class="flex flex-row arrivalCard min-w-75" data-destination="{arrival.destName}" data-line="{arrival.route.toString()}" class:italic={arrival.isScheduled}>
    <div class="w-full flex flex-col gap-0">
        <div class="align-middle text-xl">
            {arrival.destName}
        </div>
    </div>
    
    <div class="w-fit text-nowrap text-xl">
        {#if minsUntil <= 1 || arrival.isApproaching}
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
</style>
