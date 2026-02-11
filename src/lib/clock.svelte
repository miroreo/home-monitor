<script lang="ts">
	import { onMount } from "svelte";

    let currentTime = $state(new Date());

    let hours = $derived(currentTime.getHours());
    let minutes = $derived(currentTime.getMinutes());
    let seconds = $derived(currentTime.getSeconds());

    let year = $derived(currentTime.getFullYear());
    // let month = $derived(currentTime.getMonth());
    let day = $derived(currentTime.getDate());
    onMount(() => {
        setInterval(() => {
            currentTime = new Date()
        }, 1000)
    });
    let dayOfWeek = $derived(["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"][currentTime.getDay()]);
    let month = $derived(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][currentTime.getMonth()])

</script>

<div class="flex flex-row text-nowrap font-semibold">
    <div class="p-5 text-5xl w-full">{dayOfWeek} {month} {day}, {year}</div>
    <div class="w-full p-5 text-5xl">{currentTime.toLocaleTimeString()}</div>
</div>