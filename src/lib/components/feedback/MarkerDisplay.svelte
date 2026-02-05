<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { feedbackStore } from '$lib/stores/feedback';
	import type { FeedbackMarker } from '$lib/types/feedback';

	interface Props {
		marker: FeedbackMarker;
		isHighlighted?: boolean;
	}

	let { marker, isHighlighted = false }: Props = $props();

	let isExpanded = $state(false);
	let newComment = $state('');
	let position = $state({ x: 0, y: 0 });
	let targetElement: HTMLElement | null = $state(null);
	let rafId: number | null = null;
	let wasHighlighted = $state(false);
	let panelAlign = $state<'left' | 'center' | 'right'>('center');
	let panelAbove = $state(false);

	// Panel dimensions
	const PANEL_WIDTH = 288; // w-72 = 288px
	const PANEL_HEIGHT = 250; // Approximate panel height
	const MARGIN = 16;

	// Find the target element using selector or xpath
	function findElement(): HTMLElement | null {
		// Try CSS selector first
		try {
			const el = document.querySelector(marker.anchor.selector) as HTMLElement | null;
			if (el) return el;
		} catch {
			// Invalid selector, try xpath
		}

		// Fallback to XPath
		try {
			const result = document.evaluate(
				marker.anchor.xpath,
				document,
				null,
				XPathResult.FIRST_ORDERED_NODE_TYPE,
				null
			);
			if (result.singleNodeValue) {
				return result.singleNodeValue as HTMLElement;
			}
		} catch {
			// XPath failed
		}

		return null;
	}

	// Calculate position based on element or fallback
	function updatePosition(): void {
		targetElement = findElement();

		let newX: number;
		let newY: number;

		if (targetElement) {
			const rect = targetElement.getBoundingClientRect();
			newX = rect.left + marker.anchor.offsetX;
			newY = rect.top + marker.anchor.offsetY;
		} else {
			// Use fallback position (percentage of viewport)
			newX = (marker.fallbackPosition.xPercent / 100) * window.innerWidth;
			newY = (marker.fallbackPosition.yPercent / 100) * window.innerHeight;
		}

		position = { x: newX, y: newY };

		// Calculate panel horizontal alignment
		const halfPanel = PANEL_WIDTH / 2;
		if (newX - halfPanel < MARGIN) {
			panelAlign = 'left';
		} else if (newX + halfPanel > window.innerWidth - MARGIN) {
			panelAlign = 'right';
		} else {
			panelAlign = 'center';
		}

		// Calculate panel vertical position
		// Pin is ~32px tall, panel appears below with 8px margin
		const pinHeight = 32;
		const spaceBelow = window.innerHeight - newY - pinHeight;
		const spaceAbove = newY - pinHeight;

		if (spaceBelow < PANEL_HEIGHT + MARGIN && spaceAbove > spaceBelow) {
			panelAbove = true;
		} else {
			panelAbove = false;
		}
	}

	// Throttled update using requestAnimationFrame
	function scheduleUpdate(): void {
		if (rafId !== null) return;
		rafId = requestAnimationFrame(() => {
			updatePosition();
			rafId = null;
		});
	}

	// Scroll marker into view when highlighted, close when unhighlighted (from sidebar)
	$effect(() => {
		if (isHighlighted && !wasHighlighted && targetElement) {
			// Just became highlighted (from sidebar click)
			targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
			isExpanded = true;
		} else if (!isHighlighted && wasHighlighted) {
			// Just became unhighlighted (another marker was selected from sidebar)
			isExpanded = false;
		}
		wasHighlighted = isHighlighted;
	});

	function handlePinClick(e: MouseEvent): void {
		e.stopPropagation();
		isExpanded = !isExpanded;
	}

	function handleToggleStatus(e: MouseEvent): void {
		e.stopPropagation();
		const newStatus = marker.status === 'open' ? 'resolved' : 'open';
		feedbackStore.setStatus(marker.id, newStatus);
	}

	function handleAddComment(): void {
		if (newComment.trim()) {
			feedbackStore.addComment(marker.id, newComment);
			newComment = '';
		}
	}

	function handleDelete(): void {
		feedbackStore.deleteMarker(marker.id);
	}

	function handleKeydown(e: KeyboardEvent): void {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleAddComment();
		}
	}

	onMount(() => {
		updatePosition();
		window.addEventListener('scroll', scheduleUpdate, true);
		window.addEventListener('resize', scheduleUpdate);
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('scroll', scheduleUpdate, true);
			window.removeEventListener('resize', scheduleUpdate);
			if (rafId !== null) {
				cancelAnimationFrame(rafId);
			}
		}
	});
</script>

<div
	data-feedback-tool="marker"
	class="fixed z-[99999]"
	style="left: {position.x}px; top: {position.y}px; transform: translate(-50%, -50%);"
>
	<!-- Pin container -->
	<div class="relative">
		<button
			onclick={handlePinClick}
			class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-lg transition-transform hover:scale-110 {marker.status ===
			'open'
				? 'bg-orange-500'
				: 'bg-green-500'} {isHighlighted ? 'ring-4 ring-orange-300 ring-offset-2' : ''}"
		>
			<span class="text-sm font-bold text-white">{marker.number}</span>
		</button>

		<!-- Resolve button -->
		<button
			onclick={handleToggleStatus}
			class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-white shadow transition-colors hover:bg-gray-100"
			title={marker.status === 'open' ? 'Mark as resolved' : 'Reopen'}
		>
			{#if marker.status === 'open'}
				<svg class="h-3 w-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
			{:else}
				<svg class="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
					<path
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						stroke="currentColor"
						stroke-width="2"
						fill="none"
					/>
				</svg>
			{/if}
		</button>
	</div>

	<!-- Expanded panel -->
	{#if isExpanded}
		<div
			data-feedback-tool="panel"
			class="absolute w-72 rounded-lg border border-gray-200 bg-white shadow-xl {panelAbove ? 'bottom-full mb-2' : 'top-full mt-2'} {panelAlign === 'left' ? 'left-0' : panelAlign === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'}"
		>
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-gray-100 px-3 py-2">
				<div class="flex items-center gap-2">
					<span
						class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {marker.status ===
						'open'
							? 'bg-orange-100 text-orange-700'
							: 'bg-green-100 text-green-700'}"
					>
						{marker.status}
					</span>
					<span class="text-xs text-gray-500">{marker.anchor.tagName}</span>
				</div>
				<button
					onclick={handleDelete}
					class="rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
					title="Delete marker"
				>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
						/>
					</svg>
				</button>
			</div>

			<!-- Comments -->
			<div class="max-h-48 overflow-y-auto px-3 py-2">
				{#if marker.comments.length === 0}
					<p class="text-center text-sm text-gray-400">No comments yet</p>
				{:else}
					{#each marker.comments as comment}
						<div class="mb-2 rounded bg-gray-50 p-2">
							<div class="mb-1 flex items-center justify-between">
								<span class="text-xs font-medium text-gray-700">{comment.author}</span>
								<span class="text-xs text-gray-400">
									{new Date(comment.createdAt).toLocaleDateString()}
								</span>
							</div>
							<p class="text-sm text-gray-600">{comment.content}</p>
						</div>
					{/each}
				{/if}
			</div>

			<!-- Add comment -->
			<div class="border-t border-gray-100 px-3 py-2">
				<div class="flex gap-2">
					<input
						type="text"
						bind:value={newComment}
						onkeydown={handleKeydown}
						placeholder="Add a comment..."
						class="flex-1 rounded border border-gray-200 px-2 py-1 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
					/>
					<button
						onclick={handleAddComment}
						disabled={!newComment.trim()}
						class="rounded bg-orange-500 px-2 py-1 text-sm text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Add
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
