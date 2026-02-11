<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
		children?: Snippet;
        cardTitle?: string;
        cardText?: string;
	}
    let { children, cardTitle, cardText}: Props = $props();
</script>
<div class="card">
    {#if cardTitle}
    <h2>{cardTitle}</h2>
    {/if}
    {#if cardText !== null}
    <p>{cardText}</p>
    {/if}
    {#if typeof children == "function"}
        {@render children()}
    {/if}
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
</style>
