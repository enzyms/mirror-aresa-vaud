<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { feedbackStore } from '$lib/stores/feedback';
	import MarkerDisplay from './MarkerDisplay.svelte';

	// State
	let hoveredElement: HTMLElement | null = $state(null);
	let commentText = $state('');
	let commentPosition: { x: number; y: number } | null = $state(null);
	let commentInputRef: HTMLInputElement | null = $state(null);
	let captureLayerRef: HTMLDivElement | null = $state(null);
	let commentPopupRef: HTMLDivElement | null = $state(null);
	let popupAbove = $state(false);

	// Helper: get element at point, ignoring the capture layer
	function getElementAtPoint(x: number, y: number): HTMLElement | null {
		if (captureLayerRef) {
			captureLayerRef.style.pointerEvents = 'none';
		}
		const target = document.elementFromPoint(x, y) as HTMLElement | null;
		if (captureLayerRef) {
			captureLayerRef.style.pointerEvents = 'auto';
		}
		return target;
	}

	// Derived from stores
	const isActive = feedbackStore.isActive;
	const preparedMarker = feedbackStore.preparedMarker;
	const markers = feedbackStore.markers;
	const highlightedMarkerId = feedbackStore.highlightedMarkerId;

	// Computed: markers for current page
	let currentPageMarkers = $derived(
		$markers.filter((m) => m.pagePath === $page.url.pathname)
	);

	// Helper: check if element is part of the feedback tool
	function isToolElement(element: HTMLElement): boolean {
		return !!element.closest('[data-feedback-tool]');
	}

	// Apply highlight styles to hovered element
	function applyHoverStyles(element: HTMLElement | null, intense = false): void {
		if (element) {
			element.style.outline = `2px solid rgba(249, 115, 22, ${intense ? '1' : '0.7'})`;
			element.style.outlineOffset = '2px';
			element.style.backgroundColor = intense ? 'rgba(249, 115, 22, 0.1)' : 'rgba(249, 115, 22, 0.05)';
			element.style.transition = 'outline-color 200ms ease-out, background-color 200ms ease-out';
		}
	}

	// Remove highlight styles
	function removeHoverStyles(element: HTMLElement | null): void {
		if (element) {
			element.style.outline = '';
			element.style.outlineOffset = '';
			element.style.backgroundColor = '';
			element.style.transition = '';
		}
	}

	// Handle mouse move over capture layer
	function handleMouseMove(e: MouseEvent): void {
		const target = getElementAtPoint(e.clientX, e.clientY);

		if (!target || isToolElement(target)) {
			if (hoveredElement) {
				removeHoverStyles(hoveredElement);
				hoveredElement = null;
			}
			return;
		}

		if (target !== hoveredElement) {
			removeHoverStyles(hoveredElement);
			hoveredElement = target;
			applyHoverStyles(hoveredElement);
		}
	}

	// Handle click on element
	function handleClick(e: MouseEvent): void {
		e.preventDefault();
		e.stopPropagation();

		const target = getElementAtPoint(e.clientX, e.clientY);

		if (!target || isToolElement(target)) {
			return;
		}

		// Calculate offset relative to element
		const rect = target.getBoundingClientRect();
		const offsetX = e.clientX - rect.left;
		const offsetY = e.clientY - rect.top;

		// Prepare the marker
		feedbackStore.prepareMarker(target, offsetX, offsetY);

		// Apply intense highlight
		applyHoverStyles(target, true);

		// Position comment popup - check if there's enough space below
		const popupHeight = 180; // Approximate popup height
		const spaceBelow = window.innerHeight - rect.bottom;
		const spaceAbove = rect.top;

		if (spaceBelow < popupHeight && spaceAbove > spaceBelow) {
			// Position above the element
			popupAbove = true;
			commentPosition = {
				x: e.clientX,
				y: rect.top - 10
			};
		} else {
			// Position below the element
			popupAbove = false;
			commentPosition = {
				x: e.clientX,
				y: rect.bottom + 10
			};
		}

		// Focus input after render
		setTimeout(() => {
			commentInputRef?.focus();
		}, 50);
	}

	// Handle toggle button click
	function handleToggle(): void {
		if ($isActive) {
			removeHoverStyles(hoveredElement);
			hoveredElement = null;
		}
		feedbackStore.toggleActive();
	}

	// Save the marker
	function handleSave(): void {
		if ($preparedMarker) {
			removeHoverStyles($preparedMarker.element);
		}
		feedbackStore.saveMarker(commentText);
		commentText = '';
		commentPosition = null;
		hoveredElement = null;
	}

	// Cancel marker creation
	function handleCancel(): void {
		if ($preparedMarker) {
			removeHoverStyles($preparedMarker.element);
		}
		feedbackStore.cancelPreparedMarker();
		commentText = '';
		commentPosition = null;
	}

	// Handle keyboard shortcuts
	function handleKeydown(e: KeyboardEvent): void {
		if (e.key === 'Escape') {
			if ($preparedMarker) {
				handleCancel();
			} else if ($isActive) {
				removeHoverStyles(hoveredElement);
				hoveredElement = null;
				feedbackStore.toggleActive();
			}
		}
	}

	// Handle comment input keydown
	function handleCommentKeydown(e: KeyboardEvent): void {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleSave();
		} else if (e.key === 'Escape') {
			e.preventDefault();
			handleCancel();
		}
	}

	// Handle click outside to close comment popup
	function handleClickOutside(e: MouseEvent): void {
		if (!commentPopupRef) return;
		const target = e.target as HTMLElement;
		if (!commentPopupRef.contains(target)) {
			handleCancel();
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		window.addEventListener('mousedown', handleClickOutside);
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('mousedown', handleClickOutside);
			removeHoverStyles(hoveredElement);
		}
	});
</script>

<!-- Toggle Button -->
<button
	data-feedback-tool="toggle"
	onclick={handleToggle}
	class="fixed bottom-6 right-6 z-[99999] flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 {$isActive
		? 'bg-gray-700 hover:bg-gray-800'
		: 'bg-orange-500 hover:bg-orange-600'}"
>
	{#if $isActive}
		<!-- X icon -->
		<svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
		</svg>
	{:else}
		<!-- Comment icon -->
		<svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
			/>
		</svg>
	{/if}

	<!-- Badge with marker count -->
	{#if currentPageMarkers.length > 0 && !$isActive}
		<span
			class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
		>
			{currentPageMarkers.length}
		</span>
	{/if}
</button>

<!-- Active mode indicator -->
{#if $isActive && !$preparedMarker}
	<div
		data-feedback-tool="indicator"
		class="fixed left-1/2 top-4 z-[99999] -translate-x-1/2 rounded-full bg-orange-500 px-4 py-2 shadow-lg"
	>
		<span class="text-sm font-medium text-white">
			Feedback mode active - Click on any element
			<kbd class="ml-2 rounded bg-orange-600 px-1.5 py-0.5 text-xs">Esc</kbd>
		</span>
	</div>
{/if}

<!-- Capture layer (when active and no prepared marker) -->
{#if $isActive && !$preparedMarker}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={captureLayerRef}
		data-feedback-tool="capture"
		class="fixed inset-0 z-[99990] cursor-crosshair"
		onmousemove={handleMouseMove}
		onclick={handleClick}
	></div>
{/if}

<!-- Comment popup (when marker is prepared) -->
{#if $preparedMarker && commentPosition}
	<div
		bind:this={commentPopupRef}
		data-feedback-tool="comment-popup"
		class="fixed z-[100000] w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-xl"
		style="left: {commentPosition.x}px; top: {commentPosition.y}px; transform: translateX(-50%) {popupAbove ? 'translateY(-100%)' : ''};"
	>
		<!-- Close button -->
		<button
			onclick={handleCancel}
			title="Close"
			class="absolute right-2 top-2 rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
		>
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>

		<div class="mb-3 flex items-center gap-2">
			<span class="inline-flex items-center rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
				Selected: {$preparedMarker.anchor.tagName}
			</span>
		</div>

		<input
			bind:this={commentInputRef}
			type="text"
			bind:value={commentText}
			onkeydown={handleCommentKeydown}
			placeholder="Add a comment (optional)..."
			class="mb-3 w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
		/>

		<div class="flex items-center justify-between">
			<span class="text-xs text-gray-400">
				<kbd class="rounded bg-gray-100 px-1">Enter</kbd> save
				<kbd class="ml-1 rounded bg-gray-100 px-1">Esc</kbd> cancel
			</span>
			<button
				onclick={handleSave}
				class="rounded bg-orange-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-orange-600"
			>
				Save marker
			</button>
		</div>
	</div>
{/if}

<!-- Render markers for current page -->
{#each currentPageMarkers as marker (marker.id)}
	<MarkerDisplay {marker} isHighlighted={marker.id === $highlightedMarkerId} />
{/each}
