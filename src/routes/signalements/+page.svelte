<script lang="ts">
	import AppShell from '$lib/components/AppShell.svelte';
	import DashboardCard from '$lib/components/DashboardCard.svelte';
	import Btn from '$lib/components/Btn.svelte';
	import {
		Plus,
		Filter,
		Search,
		AlertTriangle,
		ShieldAlert,
		Lightbulb,
		Clock,
		CheckCircle2,
		Pause,
		Eye,
		EyeOff,
		Lock,
		MoreVertical,
	} from 'lucide-svelte';

	// Mock data
	const signalements = [
		{
			id: '1',
			date: '19 jan. 2026',
			type: 'Événement indésirable',
			typeIcon: AlertTriangle,
			typeColor: 'text-red-500',
			titre: 'Retard important lors d\'une intervention urgente à Lausanne...',
			criticite: 'critique',
			statut: 'en_cours',
			anonyme: false,
			confidentiel: false,
		},
		{
			id: '2',
			date: '18 jan. 2026',
			type: 'Problème matériel',
			typeIcon: ShieldAlert,
			typeColor: 'text-amber-500',
			titre: 'Défibrillateur AMB-08 défaillant lors du contrôle quotidien...',
			criticite: 'majeur',
			statut: 'temporise',
			anonyme: false,
			confidentiel: true,
		},
		{
			id: '3',
			date: '15 jan. 2026',
			type: 'Suggestion amélioration',
			typeIcon: Lightbulb,
			typeColor: 'text-blue-500',
			titre: 'Proposition de nouveau protocole pour le transport pédiatrique...',
			criticite: 'mineur',
			statut: 'termine',
			anonyme: true,
			confidentiel: false,
		},
		{
			id: '4',
			date: '12 jan. 2026',
			type: 'Presqu\'accident',
			typeIcon: AlertTriangle,
			typeColor: 'text-orange-500',
			titre: 'Erreur évitée lors de l\'administration de médicaments...',
			criticite: 'modere',
			statut: 'termine',
			anonyme: false,
			confidentiel: false,
		},
	];

	let searchQuery = $state('');
	let filterStatut = $state('tous');

	const filteredSignalements = $derived(
		signalements.filter(s => {
			const matchesSearch = s.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
				s.type.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatut = filterStatut === 'tous' || s.statut === filterStatut;
			return matchesSearch && matchesStatut;
		})
	);

	function getCriticiteBadge(criticite: string) {
		switch (criticite) {
			case 'critique':
				return 'bg-red-100 text-red-700 border-red-200';
			case 'majeur':
				return 'bg-orange-100 text-orange-700 border-orange-200';
			case 'modere':
				return 'bg-amber-100 text-amber-700 border-amber-200';
			case 'mineur':
				return 'bg-blue-100 text-blue-700 border-blue-200';
			default:
				return 'bg-gray-100 text-gray-700 border-gray-200';
		}
	}

	function getStatutBadge(statut: string) {
		switch (statut) {
			case 'en_cours':
				return { icon: Clock, class: 'bg-blue-100 text-blue-700', label: 'En cours' };
			case 'temporise':
				return { icon: Pause, class: 'bg-amber-100 text-amber-700', label: 'Temporisé' };
			case 'termine':
				return { icon: CheckCircle2, class: 'bg-emerald-100 text-emerald-700', label: 'Terminé' };
			default:
				return { icon: Clock, class: 'bg-gray-100 text-gray-700', label: statut };
		}
	}
</script>

<svelte:head>
	<title>Signalements Qualité - ARESA</title>
</svelte:head>

<AppShell
	title="Signalements Qualité"
	subtitle="Démarche Just Culture - Amélioration continue"
	breadcrumbs={[{ label: 'Signalements' }]}
>
	{#snippet actions()}
		<Btn variant="primary" size="md" icon={Plus} href="/signalements/new">
			Nouveau signalement
		</Btn>
	{/snippet}

	<div class="space-y-6">
		<!-- Just Culture Banner -->
		<div class="bg-primary-50 border border-primary-200 rounded-xl p-4 flex items-start gap-3">
			<div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
				<ShieldAlert size={20} class="text-primary-600" />
			</div>
			<div>
				<h3 class="text-sm font-semibold text-primary-800">Démarche Just Culture</h3>
				<p class="text-sm text-primary-700 mt-0.5">
					Vos signalements contribuent à l'amélioration continue de notre service.
					L'objectif n'est pas de blâmer mais d'apprendre ensemble.
				</p>
			</div>
		</div>

		<!-- Filters & Search -->
		<DashboardCard>
			<div class="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
				<!-- Search -->
				<div class="relative flex-1 max-w-md">
					<Search size={16} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Rechercher dans les signalements..."
						bind:value={searchQuery}
						class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					/>
				</div>

				<!-- Filter buttons -->
				<div class="flex items-center gap-2">
					<button
						class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors {filterStatut === 'tous' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
						onclick={() => filterStatut = 'tous'}
					>
						Tous
					</button>
					<button
						class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors {filterStatut === 'en_cours' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
						onclick={() => filterStatut = 'en_cours'}
					>
						En cours
					</button>
					<button
						class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors {filterStatut === 'temporise' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
						onclick={() => filterStatut = 'temporise'}
					>
						Temporisé
					</button>
					<button
						class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors {filterStatut === 'termine' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
						onclick={() => filterStatut = 'termine'}
					>
						Terminé
					</button>
				</div>
			</div>
		</DashboardCard>

		<!-- Signalements List -->
		<div class="space-y-3">
			{#each filteredSignalements as signalement}
				{@const statutBadge = getStatutBadge(signalement.statut)}
				<DashboardCard>
					<a href="/signalements/{signalement.id}" class="block p-5 hover:bg-gray-50 transition-colors">
						<div class="flex items-start gap-4">
							<!-- Type Icon -->
							<div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
								<signalement.typeIcon size={20} class={signalement.typeColor} />
							</div>

							<!-- Content -->
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2 mb-1">
									<span class="text-xs text-gray-500">{signalement.date}</span>
									<span class="text-xs text-gray-300">•</span>
									<span class="text-xs font-medium {signalement.typeColor}">{signalement.type}</span>
									{#if signalement.anonyme}
										<span class="text-xs text-gray-400 flex items-center gap-1">
											<EyeOff size={12} />
											Anonyme
										</span>
									{/if}
									{#if signalement.confidentiel}
										<span class="text-xs text-amber-600 flex items-center gap-1">
											<Lock size={12} />
											Confidentiel
										</span>
									{/if}
								</div>
								<p class="text-sm font-medium text-gray-900 line-clamp-2">{signalement.titre}</p>
							</div>

							<!-- Badges -->
							<div class="flex items-center gap-2 shrink-0">
								<span class="px-2 py-1 rounded-full text-xs font-semibold border capitalize {getCriticiteBadge(signalement.criticite)}">
									{signalement.criticite}
								</span>
								<span class="px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 {statutBadge.class}">
									<statutBadge.icon size={12} />
									{statutBadge.label}
								</span>
							</div>
						</div>
					</a>
				</DashboardCard>
			{/each}

			{#if filteredSignalements.length === 0}
				<DashboardCard>
					<div class="p-8 text-center">
						<ShieldAlert size={40} class="mx-auto text-gray-300 mb-3" />
						<p class="text-gray-500">Aucun signalement trouvé</p>
					</div>
				</DashboardCard>
			{/if}
		</div>
	</div>
</AppShell>
