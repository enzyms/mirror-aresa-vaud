<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import PageSubTitle from '$lib/components/PageSubTitle.svelte';
	import DashboardCard from '$lib/components/DashboardCard.svelte';
	let isMobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}
</script>

<svelte:head>
	<title>ARESA - Annonces</title>
</svelte:head>

<div class="flex flex-col gap-3 min-h-screen p-3 pb-6">
	<!-- Top Navigation -->
	<Navigation onMenuToggle={toggleMobileMenu} {isMobileMenuOpen} />

	<!-- Main Content Area -->
	<div class="flex flex-1 gap-3">
		<!-- Sidebar -->
		<div class="hidden lg:block shrink-0">
			<Sidebar isOpen={true} />
		</div>
		
		<!-- Mobile Sidebar -->
		<div class="lg:hidden">
			<Sidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
		</div>

		<!-- Main Content -->
		<main class="flex-1 bg-gray-50 overflow-hidden flex flex-col">
			<!-- Breadcrumb -->
			<Breadcrumb items={[{ label: 'Accueil', href: '/' }, { label: 'Annonces' }]} />

			<!-- Title -->
			<PageTitle title="Annonces" />

			<!-- Content -->
			<PageSubTitle>Communications et informations importantes.</PageSubTitle>

			<!-- Placeholder content -->
			<div class="px-4 md:px-10 lg:px-20 pb-4 flex-1 flex flex-col">
				<DashboardCard class="flex-1 h-auto" />
			</div>
		</main>
	</div>
</div>

