<script lang="ts">
	import Navigation from './Navigation.svelte';
	import Sidebar from './Sidebar.svelte';
	import Breadcrumb from './Breadcrumb.svelte';
	import PageTitle from './PageTitle.svelte';
	import PageSubTitle from './PageSubTitle.svelte';
	import { modeStore } from '$lib/stores/mode.svelte';
	import type { Snippet } from 'svelte';

	interface BreadcrumbItem {
		label: string;
		href?: string;
	}

	interface Props {
		title: string;
		subtitle?: string;
		breadcrumbs?: BreadcrumbItem[];
		children: Snippet;
		actions?: Snippet;
	}

	let { title, subtitle, breadcrumbs = [], children, actions }: Props = $props();

	let isMobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}
</script>

<div class="flex flex-col gap-3 min-h-screen p-3 pb-6">
	<!-- Top Navigation -->
	<Navigation onMenuToggle={toggleMobileMenu} {isMobileMenuOpen} />

	<!-- Main Content Area -->
	<div class="flex flex-1">
		<!-- Sidebar -->
		{#if modeStore.current !== 'intervention'}
			<div class="hidden lg:block shrink-0">
				<Sidebar isOpen={true} />
			</div>

			<!-- Mobile Sidebar -->
			<div class="lg:hidden">
				<Sidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
			</div>
		{/if}

		<!-- Main Content -->
		<main class="flex-1 bg-gray-50 overflow-hidden">
			{#if modeStore.current !== 'intervention'}
				<Breadcrumb items={[{ label: 'Accueil', href: '/' }, ...breadcrumbs]} />
				<div class="flex items-center justify-between">
					<div>
						<PageTitle {title} />
						{#if subtitle}
							<PageSubTitle>{subtitle}</PageSubTitle>
						{/if}
					</div>
					{#if actions}
						<div class="md:px-8 xl:px-20">
							{@render actions()}
						</div>
					{/if}
				</div>
			{/if}

			<!-- Page Content -->
			<div class="md:px-8 xl:px-20 pb-8 md:pt-6" class:pt-0={modeStore.current === 'intervention'}>
				{@render children()}
			</div>
		</main>
	</div>
</div>
