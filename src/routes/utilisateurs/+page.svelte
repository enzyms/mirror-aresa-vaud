<script lang="ts">
	import { Search } from 'lucide-svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import PageSubTitle from '$lib/components/PageSubTitle.svelte';
	import DashboardCard from '$lib/components/DashboardCard.svelte';
	import UserListItem from '$lib/components/UserListItem.svelte';
	import { users } from '$lib/data/users';

	let isMobileMenuOpen = $state(false);
	let searchQuery = $state('');
	let debounceTimer: ReturnType<typeof setTimeout>;

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}

	const roleLabels: Record<string, string> = {
		ad: 'ambulancier diplômé',
		ta: 'technicien ambulancier',
		etudiant: 'étudiant'
	};

	let debouncedQuery = $state('');

	function handleSearchInput(event: Event) {
		const target = event.target as HTMLInputElement;
		searchQuery = target.value;

		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			debouncedQuery = searchQuery;
		}, 300);
	}

	const filteredUsers = $derived(() => {
		if (!debouncedQuery.trim()) return users;

		const query = debouncedQuery.toLowerCase().trim();
		return users.filter((user) => {
			const fullName = `${user.prenom} ${user.nom}`.toLowerCase();
			const reverseName = `${user.nom} ${user.prenom}`.toLowerCase();
			const email = user.email.toLowerCase();
			const role = roleLabels[user.role_base];

			return (
				fullName.includes(query) ||
				reverseName.includes(query) ||
				email.includes(query) ||
				role.includes(query)
			);
		});
	});
</script>

<svelte:head>
	<title>ARESA - Utilisateurs</title>
</svelte:head>

<div class="flex flex-col gap-3 min-h-screen p-3 pb-6">
	<!-- Top Navigation -->
	<Navigation onMenuToggle={toggleMobileMenu} {isMobileMenuOpen} />

	<!-- Main Content Area -->
	<div class="flex flex-1">
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
			<Breadcrumb items={[{ label: 'Accueil', href: '/' }, { label: 'Utilisateurs' }]} />

			<!-- Title -->
			<PageTitle title="Utilisateurs" />

			<!-- Content -->
			<PageSubTitle>Gestion des utilisateurs du système.</PageSubTitle>

			<!-- User List -->
			<div class="md:px-8 xl:px-20 pb-4 flex-1 flex flex-col">
				<DashboardCard class="flex-1 h-auto flex flex-col overflow-hidden">
					<!-- Search Header -->
					<div class="p-4 border-b border-gray-100">
						<div class="relative">
							<Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
							<input
								type="text"
								placeholder="Rechercher un utilisateur..."
								value={searchQuery}
								oninput={handleSearchInput}
								class="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
							/>
						</div>
					</div>

					<!-- User List -->
					<div class="flex-1 overflow-y-auto">
						{#if filteredUsers().length === 0}
							<div class="flex items-center justify-center h-32 text-gray-500 text-sm">
								Aucun utilisateur trouvé
							</div>
						{:else}
							{#each filteredUsers() as user (user.id)}
								<UserListItem {user} />
							{/each}
						{/if}
					</div>
				</DashboardCard>
			</div>
		</main>
	</div>
</div>
