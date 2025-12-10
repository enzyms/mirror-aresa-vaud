<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className = '', children }: Props = $props();
</script>

<div class="bg-white rounded-[13px] shadow-card {className}">
	{#if children}
		{@render children()}
	{/if}
</div>

