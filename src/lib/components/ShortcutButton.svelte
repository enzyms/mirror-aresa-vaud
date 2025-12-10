<script lang="ts">
	import type { ComponentType } from 'svelte';

	interface Props {
		label: string;
		href: string;
		icon: ComponentType;
		iconBgColor?: string;
	}

	let { 
		label, 
		href, 
		icon: Icon,
		iconBgColor = 'bg-primary-100'
	}: Props = $props();
</script>

<a 
	{href}
	class="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-primary-50 transition-colors group"
>
	<div class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-700 group-hover:scale-110 transition-transform">
		<Icon size={22} />
	</div>
	<span class="text-sm text-gray-700 text-center font-medium leading-tight">{label}</span>
</a>

