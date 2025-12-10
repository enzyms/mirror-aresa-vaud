<script lang="ts">
	import type { ComponentType } from 'svelte';

	interface Props {
		time: string;
		title: string;
		type: string;
		icon: ComponentType;
		iconColor?: string;
	}

	let { 
		time, 
		title, 
		type,
		icon: Icon,
		iconColor = 'text-primary-600'
	}: Props = $props();
</script>

<div class="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
	<div class="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center {iconColor} shrink-0">
		<Icon size={18} />
	</div>
	<div class="flex-1 min-w-0">
		<p class="text-sm font-medium text-gray-900 truncate">{title}</p>
		<p class="text-xs text-gray-500">{type}</p>
	</div>
	<span class="text-xs font-semibold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full shrink-0">
		{time}
	</span>
</div>

