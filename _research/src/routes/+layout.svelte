<script lang="ts">
	import '../app.css';
	import { checklistStore } from '$lib/stores/checklist.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		checklistStore.init();
	});

	const progress = $derived(checklistStore.getProgress());
</script>

<div class="app">
	<header>
		<div class="header-content">
			<h1>📋 ARESA Research</h1>
			<div class="progress-bar">
				<div class="progress-fill" style="width: {(progress.checked / progress.total) * 100}%"></div>
			</div>
			<div class="progress-stats">
				<span>{progress.checked}/{progress.total} complétés</span>
				<span>{progress.withNotes} notes</span>
				<span>{progress.withFiles} fichiers</span>
			</div>
		</div>
	</header>

	<main>
		{@render children()}
	</main>
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	header {
		background: white;
		border-bottom: 1px solid var(--gray-200);
		padding: 16px;
		position: sticky;
		top: 0;
		z-index: 100;
		box-shadow: var(--shadow);
	}

	.header-content {
		max-width: 800px;
		margin: 0 auto;
	}

	h1 {
		font-size: 20px;
		margin-bottom: 12px;
	}

	.progress-bar {
		height: 8px;
		background: var(--gray-200);
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 8px;
	}

	.progress-fill {
		height: 100%;
		background: var(--success);
		transition: width 0.3s;
	}

	.progress-stats {
		display: flex;
		gap: 16px;
		font-size: 12px;
		color: var(--gray-500);
	}

	main {
		flex: 1;
		padding: 16px;
		max-width: 800px;
		margin: 0 auto;
		width: 100%;
	}
</style>
