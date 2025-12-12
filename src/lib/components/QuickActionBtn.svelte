<script lang="ts">
	import type { ComponentType } from 'svelte';
	import { Check } from 'lucide-svelte';

	type ColorScheme = 'emerald' | 'blue' | 'rose' | 'violet' | 'orange' | 'cyan' | 'red' | 'amber';

	interface Props {
		icon: ComponentType;
		label: string;
		description?: string;
		color: ColorScheme;
		completed?: boolean;
		onclick?: () => void;
	}

	let { icon: Icon, label, description, color, completed = false, onclick }: Props = $props();

	const colorClasses: Record<ColorScheme, { bg: string; hover: string; border: string; text: string; desc: string; iconText: string }> = {
		emerald: {
			bg: 'bg-emerald-100',
			hover: 'hover:bg-emerald-200',
			border: 'border-emerald-300',
			text: 'text-emerald-800',
			desc: 'text-emerald-600',
			iconText: 'text-emerald-700'
		},
		blue: {
			bg: 'bg-blue-100',
			hover: 'hover:bg-blue-200',
			border: 'border-blue-300',
			text: 'text-blue-800',
			desc: 'text-blue-600',
			iconText: 'text-blue-700'
		},
		rose: {
			bg: 'bg-rose-100',
			hover: 'hover:bg-rose-200',
			border: 'border-rose-300',
			text: 'text-rose-800',
			desc: 'text-rose-600',
			iconText: 'text-rose-700'
		},
		violet: {
			bg: 'bg-violet-100',
			hover: 'hover:bg-violet-200',
			border: 'border-violet-300',
			text: 'text-violet-800',
			desc: 'text-violet-600',
			iconText: 'text-violet-700'
		},
		orange: {
			bg: 'bg-orange-100',
			hover: 'hover:bg-orange-200',
			border: 'border-orange-300',
			text: 'text-orange-800',
			desc: 'text-orange-600',
			iconText: 'text-orange-700'
		},
		cyan: {
			bg: 'bg-cyan-100',
			hover: 'hover:bg-cyan-200',
			border: 'border-cyan-300',
			text: 'text-cyan-800',
			desc: 'text-cyan-600',
			iconText: 'text-cyan-700'
		},
		red: {
			bg: 'bg-red-50',
			hover: 'hover:bg-red-100',
			border: 'border-red-200',
			text: 'text-red-800',
			desc: 'text-red-600',
			iconText: 'text-red-600'
		},
		amber: {
			bg: 'bg-amber-50',
			hover: 'hover:bg-amber-100',
			border: 'border-amber-200',
			text: 'text-amber-800',
			desc: 'text-amber-600',
			iconText: 'text-amber-600'
		}
	};

	const colors = colorClasses[color];
</script>

{#if description}
	<!-- Horizontal layout with description -->
	<button 
		class="w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left
			{colors.bg} {colors.hover} border-3 {colors.border}"
		{onclick}
	>
		<Icon size={18} class="{colors.iconText} shrink-0" />
		<div>
			<p class="text-sm font-medium {colors.text}">{label}</p>
			<p class="text-xs {colors.desc}">{description}</p>
		</div>
	</button>
{:else}
	<!-- Compact vertical layout -->
	<button 
		class="relative flex flex-col items-center justify-center p-3 xl:p-4 rounded-xl transition-colors group
			{colors.bg} {completed ? '' : colors.hover}
			border-3 {completed ? 'border-transparent' : `${colors.border} shadow-xl`}"
		{onclick}
	>
		{#if completed}
			<div class="absolute top-1.5 right-1.5 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
				<Check size={12} class="text-white stroke-[5px]" />
			</div>
		{/if}
		<Icon size={24} class="{colors.iconText} mb-1 group-hover:scale-110 transition-transform" />
		<span class="font-semibold {colors.text}">{label}</span>
	</button>
{/if}

