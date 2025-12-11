<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface CardDefinition {
		id: string;
		component: Snippet;
		visibleModes?: string[];
		excludeModes?: string[];
	}
</script>

<script lang="ts">
	import { modeStore } from '$lib/stores/mode.svelte';
	import { dashboardLayouts } from '$lib/config/layouts';

	interface Props {
		cards: CardDefinition[];
		class?: string;
	}

	let { cards, class: className = '' }: Props = $props();

	// Get the current mode's layout
	let currentLayout = $derived(dashboardLayouts[modeStore.current]);

	// Create a map of card ID -> card definition for quick lookup
	let cardMap = $derived(new Map(cards.map(card => [card.id, card])));

	// Check if a card should be visible in the current mode
	function isCardVisible(card: CardDefinition): boolean {
		const mode = modeStore.current;
		
		// If visibleModes is set, card must be in that list
		if (card.visibleModes && card.visibleModes.length > 0) {
			return card.visibleModes.includes(mode);
		}
		
		// If excludeModes is set, card must NOT be in that list
		if (card.excludeModes && card.excludeModes.length > 0) {
			return !card.excludeModes.includes(mode);
		}
		
		// Default: visible in all modes
		return true;
	}

	// Get card by ID if it exists and is visible
	function getCard(cardId: string): CardDefinition | null {
		const card = cardMap.get(cardId);
		if (!card) return null;
		if (!isCardVisible(card)) return null;
		return card;
	}

	// Filter a row to only include visible cards
	function getVisibleCardsInRow(row: string[]): Array<{ id: string; card: CardDefinition }> {
		return row
			.map(id => ({ id, card: getCard(id) }))
			.filter((item): item is { id: string; card: CardDefinition } => item.card !== null);
	}
</script>

<div class="flex flex-col gap-6 md:gap-8 {className}">
	<!-- Extra large screens (xl and up) -->
	<div class="hidden xl:flex xl:flex-col gap-6">
		{#each currentLayout.lg as row}
			{@const visibleCards = getVisibleCardsInRow(row)}
			{#if visibleCards.length > 0}
				<div 
					class="grid gap-6 items-stretch"
					style="grid-template-columns: repeat({visibleCards.length}, minmax(0, 1fr));"
				>
					{#each visibleCards as { id, card } (id)}
						<div data-card-id={id} class="flex flex-col [&>*]:flex-1 [&>*]:h-full">
							{@render card.component()}
						</div>
					{/each}
				</div>
			{/if}
		{/each}
	</div>

	<!-- Small/Medium/Large screens (below xl) -->
	<div class="flex flex-col gap-4 xl:hidden">
		{#each currentLayout.sm as row}
			{@const visibleCards = getVisibleCardsInRow(row)}
			{#if visibleCards.length > 0}
				<div 
					class="grid gap-4 items-stretch"
					style="grid-template-columns: repeat({visibleCards.length}, minmax(0, 1fr));"
				>
					{#each visibleCards as { id, card } (id)}
						<div data-card-id={id} class="flex flex-col [&>*]:flex-1 [&>*]:h-full">
							{@render card.component()}
						</div>
					{/each}
				</div>
			{/if}
		{/each}
	</div>
</div>
