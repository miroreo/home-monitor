<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	import { setContext } from 'svelte';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	setContext('status', () => data.status);

	setContext('weather', () => data.weather);
	// let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="min-w-full overflow-x-hidden">
{@render children()}	
</div>
