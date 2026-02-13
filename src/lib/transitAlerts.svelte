<script lang="ts">
	import type { TransitAlert } from "./cta";

    interface Props {
        alerts: TransitAlert[]
	}
    let { alerts }: Props = $props();
</script>

<div class="card">
    <h2>Transit Alerts</h2>
    {#each alerts as alert}
        {alert.id}
    {/each}
</div>
<style>
    @import 'tailwindcss';
    .card {
        @apply m-2 p-5 bg-gray-800 rounded-2xl flex flex-col gap-y-2;
    }
</style>