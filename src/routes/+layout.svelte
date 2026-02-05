<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import '../app.css';
	import FeedbackTool from '$lib/components/feedback/FeedbackTool.svelte';
	import { feedbackStore } from '$lib/stores/feedback';
	import type { ParentToAppMessage } from '$lib/types/feedback';

	let { children } = $props();

	// Subscribe to markers store reactively
	const markersStore = feedbackStore.markers;

	// Notify parent (sitemap-presenter) on navigation OR when markers change
	$effect(() => {
		if (!browser || !window.parent || window.parent === window) return;

		const currentUrl = $page.url.href;
		const currentPath = $page.url.pathname;
		const currentTitle = document.title;
		// Access store value reactively (this creates a dependency)
		const allMarkers = $markersStore;
		// Filter markers for current page only
		const pageMarkers = allMarkers.filter((m) => m.pagePath === currentPath);

		console.log('[Aresa] Sending navigation with markers:', pageMarkers.length, 'of', allMarkers.length, 'for path:', currentPath);

		window.parent.postMessage(
			{
				type: 'FEEDBACK_NAVIGATION',
				url: currentUrl,
				pathname: currentPath,
				title: currentTitle,
				markers: [...pageMarkers] // Only markers for current page
			},
			'*'
		);
	});

	onMount(() => {
		if (!browser) return;

		function handleMessage(event: MessageEvent): void {
			const data = event.data as ParentToAppMessage | undefined;
			if (!data?.type?.startsWith('FEEDBACK_')) return;

			switch (data.type) {
				case 'FEEDBACK_GET_MARKERS':
					// Return all markers, not filtered by page
					feedbackStore.sendMarkersToParent();
					break;
				case 'FEEDBACK_UPDATE_STATUS':
					feedbackStore.setStatus(data.markerId, data.status, true);
					break;
				case 'FEEDBACK_ADD_COMMENT':
					feedbackStore.addComment(data.markerId, data.content, data.author, true);
					break;
				case 'FEEDBACK_DELETE_MARKER':
					feedbackStore.deleteMarker(data.markerId, true);
					break;
				case 'FEEDBACK_HIGHLIGHT_MARKER':
					feedbackStore.setHighlightedMarker(data.markerId);
					break;
			}
		}

		window.addEventListener('message', handleMessage);
		return () => window.removeEventListener('message', handleMessage);
	});
</script>

<div class="min-h-screen bg-gray-50 font-sans">
	{@render children()}
</div>
<FeedbackTool />
