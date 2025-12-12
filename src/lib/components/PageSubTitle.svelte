<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="md:px-8 xl:px-20 pb-6 md:pb-8">
	<p class="text-base md:text-base text-gray-700 leading-relaxed">
		{@render children()}
	</p>
</div>

