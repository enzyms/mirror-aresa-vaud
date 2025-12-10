<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ComponentType } from 'svelte';
	import DashboardCard from './DashboardCard.svelte';

	interface Props {
		label: string;
		value: string | number;
		trend?: string;
		trendDirection?: 'up' | 'down' | 'neutral';
		icon: ComponentType;
		iconColor?: string;
	}

	let { 
		label, 
		value, 
		trend, 
		trendDirection = 'neutral',
		icon: Icon,
		iconColor = 'text-primary-600'
	}: Props = $props();

	const trendColorClass = {
		up: 'text-green-600',
		down: 'text-red-600',
		neutral: 'text-gray-500'
	};
</script>

<DashboardCard class="h-auto">
	<div class="flex items-center justify-between h-full p-5">
		<div class="flex flex-col">
			<p class="text-sm text-gray-500 font-medium">{label}</p>
			<p class="text-3xl font-bold text-gray-900 mt-1">{value}</p>
			{#if trend}
				<p class="text-xs {trendColorClass[trendDirection]} mt-2 font-medium">{trend}</p>
			{/if}
		</div>
		<div class="w-12 h-12 rounded-full flex items-center justify-center {iconColor}">
			<Icon size={24} />
		</div>
	</div>
</DashboardCard>

