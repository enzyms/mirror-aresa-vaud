<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import '../app.css';
	import FeedbackTool from '$lib/components/feedback/FeedbackTool.svelte';
	import { feedbackStore } from '$lib/stores/feedback';
	import type { ParentToAppMessage } from '$lib/types/feedback';

	let { children } = $props();

	onMount(() => {
		if (!browser) return;

		function handleMessage(event: MessageEvent): void {
			const data = event.data as ParentToAppMessage | undefined;
			if (!data?.type?.startsWith('FEEDBACK_')) return;

			switch (data.type) {
				case 'FEEDBACK_GET_MARKERS':
					// Always use current page path, not the one from the message
					feedbackStore.sendMarkersToParent(window.location.pathname);
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
