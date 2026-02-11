<script lang="ts">
	import Card from "./card.svelte";

    interface Props {
        price: number;
        cardText?: string;
        className?: string;
	}
    let { price }: Props = $props();

    let className = $state("bg-green-900");
</script>
<div class="card" class:low={price < 8} class:medium={price >= 8 && price <= 14} class:high={price > 14}>
    <h2>Electric Price</h2>
    <p>{price}¢</p>
</div>
<style lang="postcss">
    @import 'tailwindcss';
    @plugin '@tailwindcss/forms';
    @plugin '@tailwindcss/typography';
    h2 {
        @apply font-bold text-xl;
    }
    p {
        @apply text-center text-6xl;
    }
    .card {
        @apply m-2 p-5 bg-gray-800 rounded-2xl flex flex-col gap-y-2;
    }
    .low {
        @apply bg-green-700;
    }
    .medium {
        @apply bg-amber-700;
    }
    .high {
        @apply bg-red-700;
    }
</style>
