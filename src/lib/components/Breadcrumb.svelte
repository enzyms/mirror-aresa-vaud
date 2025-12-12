<script lang="ts">
	interface BreadcrumbItem {
		label: string;
		href?: string;
	}

	interface Props {
		items?: BreadcrumbItem[];
	}

	let { items = [{ label: 'Accueil', href: '/' }] }: Props = $props();
</script>

<div class="pt-4 px-4 md:px-8 xl:px-20 pt-1 pb-1">
	<div class="flex items-center gap-0.5 text-xs">
		{#each items as item, i}
			{@const isLast = i === items.length - 1}
			{#if isLast}
				<span class="text-gray-400">{item.label}</span>
			{:else}
				<a href={item.href} class="text-primary-700 hover:underline">{item.label}</a>
				<span class="text-primary-700">→</span>
			{/if}
		{/each}
	</div>
</div>

