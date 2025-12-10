<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ComponentType } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary';
		size?: 'sm' | 'md';
		href?: string;
		icon?: ComponentType;
		iconPosition?: 'left' | 'right';
		class?: string;
		children: Snippet;
		onclick?: () => void;
	}

	let { 
		variant = 'primary',
		size = 'md',
		href,
		icon: Icon,
		iconPosition = 'left',
		class: className = '',
		children,
		onclick
	}: Props = $props();

	const variantClasses = {
		primary: 'text-white bg-primary-600 hover:bg-primary-700',
		secondary: 'text-primary-600 bg-primary-50 hover:bg-primary-100'
	};

	const sizeClasses = {
		sm: 'py-2 pr-4  pl-3 text-xs gap-1',
		md: 'py-2.5 pr-5 pl-4 text-sm gap-2'
	};

	const iconSizes = {
		sm: 14,
		md: 16
	};

	const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full transition-colors';
</script>

{#if href}
	<a 
		{href}
		class="{baseClasses} {variantClasses[variant]} {sizeClasses[size]} {className}"
	>
		{#if Icon && iconPosition === 'left'}
			<Icon size={iconSizes[size]} />
		{/if}
		{@render children()}
		{#if Icon && iconPosition === 'right'}
			<Icon size={iconSizes[size]} />
		{/if}
	</a>
{:else}
	<button 
		type="button"
		{onclick}
		class="{baseClasses} {variantClasses[variant]} {sizeClasses[size]} {className}"
	>
		{#if Icon && iconPosition === 'left'}
			<Icon size={iconSizes[size]} />
		{/if}
		{@render children()}
		{#if Icon && iconPosition === 'right'}
			<Icon size={iconSizes[size]} />
		{/if}
	</button>
{/if}

