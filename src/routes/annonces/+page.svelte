<script lang="ts">
	import AppShell from '$lib/components/AppShell.svelte';
	import DashboardCard from '$lib/components/DashboardCard.svelte';
	import Btn from '$lib/components/Btn.svelte';
	import {
		Plus,
		Search,
		Megaphone,
		AlertTriangle,
		ArrowRightLeft,
		Info,
		Wrench,
		GraduationCap,
		FileText,
		Circle,
		Clock,
		User,
		Tag,
	} from 'lucide-svelte';

	// Mock data
	const annonces = [
		{
			id: '1',
			type: 'alerte',
			typeIcon: AlertTriangle,
			typeColor: 'text-red-500',
			typeBg: 'bg-red-100',
			titre: 'Procédure RCP mise à jour',
			extrait: 'Nouvelle version du protocole disponible. Merci de consulter le document joint et de valider la lecture...',
			date: 'Il y a 2h',
			auteur: 'Lucas P.',
			tags: ['procédure', 'RCP'],
			important: true,
			lu: false,
		},
		{
			id: '2',
			type: 'briefing',
			typeIcon: Megaphone,
			typeColor: 'text-blue-500',
			typeBg: 'bg-blue-100',
			titre: 'Briefing: congestion CHUV',
			extrait: 'Temps d\'attente estimé 45min aux urgences. Privilégier EHC si possible pour les cas non critiques...',
			date: 'Il y a 4h',
			auteur: 'Marie D.',
			tags: ['CHUV', 'Urgences'],
			important: true,
			lu: false,
		},
		{
			id: '3',
			type: 'debriefing',
			typeIcon: ArrowRightLeft,
			typeColor: 'text-purple-500',
			typeBg: 'bg-purple-100',
			titre: 'Débriefing: vérifier O2 ambulance 3',
			extrait: 'Niveau bas constaté en fin de service. Bouteille de secours utilisée lors de la dernière intervention...',
			date: 'Il y a 6h',
			auteur: 'Jean M.',
			tags: ['O2', 'Véhicule'],
			important: false,
			lu: false,
		},
		{
			id: '4',
			type: 'formation',
			typeIcon: GraduationCap,
			typeColor: 'text-emerald-500',
			typeBg: 'bg-emerald-100',
			titre: 'Formation défib. mercredi 14h',
			extrait: 'Rappel: formation obligatoire pour tous les collaborateurs. Salle de formation - Base Lausanne...',
			date: 'Hier',
			auteur: 'Admin',
			tags: ['formation'],
			important: false,
			lu: true,
		},
		{
			id: '5',
			type: 'maintenance',
			typeIcon: Wrench,
			typeColor: 'text-orange-500',
			typeBg: 'bg-orange-100',
			titre: 'Maintenance AMB-07 prévue lundi',
			extrait: 'Véhicule indisponible de 8h à 12h. Remplacement par AMB-09 pendant cette période...',
			date: 'Hier',
			auteur: 'Garage',
			tags: ['Véhicule', 'Maintenance'],
			important: false,
			lu: true,
		},
	];

	let searchQuery = $state('');
	let filterType = $state('tous');
	let showUnreadOnly = $state(false);

	const filteredAnnonces = $derived(
		annonces.filter(a => {
			const matchesSearch = a.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
				a.extrait.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesType = filterType === 'tous' || a.type === filterType;
			const matchesUnread = !showUnreadOnly || !a.lu;
			return matchesSearch && matchesType && matchesUnread;
		})
	);

	const unreadCount = $derived(annonces.filter(a => !a.lu).length);
</script>

<svelte:head>
	<title>Annonces - ARESA</title>
</svelte:head>

<AppShell
	title="Annonces"
	subtitle="Communication équipes & livre de bord"
	breadcrumbs={[{ label: 'Annonces' }]}
>
	{#snippet actions()}
		<div class="flex items-center gap-2">
			<Btn variant="secondary" size="md" href="/annonces/new">
				Débriefing
			</Btn>
			<Btn variant="primary" size="md" icon={Plus} href="/annonces/new">
				Nouvelle annonce
			</Btn>
		</div>
	{/snippet}

	<div class="space-y-6">
		<!-- Search & Filters -->
		<DashboardCard>
			<div class="p-4 space-y-4">
				<!-- Search bar -->
				<div class="relative">
					<Search size={16} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Rechercher dans les annonces..."
						bind:value={searchQuery}
						class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					/>
				</div>

				<!-- Filter pills -->
				<div class="flex flex-wrap items-center gap-2">
					<button
						class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 {showUnreadOnly ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
						onclick={() => showUnreadOnly = !showUnreadOnly}
					>
						{#if unreadCount > 0}
							<span class="w-2 h-2 rounded-full {showUnreadOnly ? 'bg-white' : 'bg-primary-500'}"></span>
						{/if}
						Non lues ({unreadCount})
					</button>
					<span class="text-gray-300">|</span>
					<button
						class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors {filterType === 'tous' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
						onclick={() => filterType = 'tous'}
					>
						Toutes
					</button>
					<button
						class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors {filterType === 'briefing' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
						onclick={() => filterType = 'briefing'}
					>
						Briefing
					</button>
					<button
						class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors {filterType === 'debriefing' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
						onclick={() => filterType = 'debriefing'}
					>
						Débriefing
					</button>
					<button
						class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors {filterType === 'alerte' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
						onclick={() => filterType = 'alerte'}
					>
						Alertes
					</button>
				</div>
			</div>
		</DashboardCard>

		<!-- Annonces List -->
		<div class="space-y-3">
			{#each filteredAnnonces as annonce}
				<DashboardCard>
					<a href="/annonces/{annonce.id}" class="block p-5 hover:bg-gray-50 transition-colors">
						<div class="flex items-start gap-4">
							<!-- Read indicator + Type icon -->
							<div class="flex items-center gap-3">
								<div class="w-2.5 h-2.5 rounded-full {annonce.lu ? 'bg-gray-200' : 'bg-primary-500'}"></div>
								<div class="w-10 h-10 rounded-full {annonce.typeBg} flex items-center justify-center shrink-0">
									<annonce.typeIcon size={20} class={annonce.typeColor} />
								</div>
							</div>

							<!-- Content -->
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2 mb-1">
									{#if annonce.important}
										<span class="text-amber-500">⚠️</span>
									{/if}
									<h3 class="text-sm font-semibold text-gray-900 {annonce.lu ? '' : 'text-gray-900'}">{annonce.titre}</h3>
								</div>
								<p class="text-sm text-gray-600 line-clamp-2 mb-2">{annonce.extrait}</p>
								<div class="flex items-center flex-wrap gap-3 text-xs text-gray-500">
									<span class="flex items-center gap-1">
										<Clock size={12} />
										{annonce.date}
									</span>
									<span class="flex items-center gap-1">
										<User size={12} />
										{annonce.auteur}
									</span>
									{#if annonce.tags.length > 0}
										<div class="flex items-center gap-1">
											<Tag size={12} />
											{#each annonce.tags as tag}
												<span class="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">#{tag}</span>
											{/each}
										</div>
									{/if}
								</div>
							</div>
						</div>
					</a>
				</DashboardCard>
			{/each}

			{#if filteredAnnonces.length === 0}
				<DashboardCard>
					<div class="p-8 text-center">
						<Megaphone size={40} class="mx-auto text-gray-300 mb-3" />
						<p class="text-gray-500">Aucune annonce trouvée</p>
					</div>
				</DashboardCard>
			{/if}
		</div>
	</div>
</AppShell>
