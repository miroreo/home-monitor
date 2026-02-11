<script lang="ts">
	import { onMount } from "svelte";

    let currentTime = $state(new Date());

    let hours = $derived(currentTime.getHours());
    let minutes = $derived(currentTime.getMinutes());
    let seconds = $derived(currentTime.getSeconds());

    let year = $derived(currentTime.getFullYear());
    let month = $derived(currentTime.getMonth());
    let day = $derived(currentTime.getDay());
    onMount(() => {
        setInterval(() => {
            currentTime = new Date()
        }, 1000)
    })
</script>

<div class="">
    <h1 class="w-full p-5 text-7xl">{currentTime.toLocaleTimeString()}</h1>
</div>