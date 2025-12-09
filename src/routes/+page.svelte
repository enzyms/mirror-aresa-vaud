<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import DashboardCard from '$lib/components/DashboardCard.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import PageSubTitle from '$lib/components/PageSubTitle.svelte';

	let isMobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}

	// Get current date in French format
	const today = new Date();
	const options: Intl.DateTimeFormatOptions = { 
		weekday: 'long', 
		day: 'numeric', 
		month: 'long', 
		year: 'numeric' 
	};
	const formattedDate = today.toLocaleDateString('fr-FR', options);
	// Capitalize first letter
	const displayDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
</script>

<svelte:head>
	<title>ARESA - Tableau de bord</title>
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
		<main class="flex-1 bg-gray-50 overflow-hidden">
			<!-- Breadcrumb -->
			<Breadcrumb items={[{ label: 'Accueil'}]} />

			<!-- Title -->
			<PageTitle title="Votre tableau de bord" />

			<!-- Date -->
			<PageSubTitle>{displayDate}</PageSubTitle>

			<!-- Cards Grid -->
			<div class="px-4 md:px-10 lg:px-20 flex flex-col gap-6 md:gap-10">
				<!-- Row 1 - 4 cards -->
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
					<DashboardCard />
					<DashboardCard />
					<DashboardCard />
					<DashboardCard />
				</div>

				<!-- Row 2 - 3 cards -->
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
					<DashboardCard />
					<DashboardCard />
					<DashboardCard />
				</div>

				<!-- Row 3 - 2 cards -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
					<DashboardCard />
					<DashboardCard />
				</div>
			</div>
		</main>
	</div>
</div>
