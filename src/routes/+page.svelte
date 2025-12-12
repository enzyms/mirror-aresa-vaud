<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import DashboardCard from '$lib/components/DashboardCard.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import PageSubTitle from '$lib/components/PageSubTitle.svelte';
	import KPICard from '$lib/components/KPICard.svelte';
	import ShortcutButton from '$lib/components/ShortcutButton.svelte';
	import ActivityItem from '$lib/components/ActivityItem.svelte';
	import QualityReportItem from '$lib/components/QualityReportItem.svelte';
	import LogbookEntry from '$lib/components/LogbookEntry.svelte';
	import Btn from '$lib/components/Btn.svelte';
	import DashboardGrid, { type CardDefinition } from '$lib/components/DashboardGrid.svelte';
	import { 
		ClipboardCheck, 
		ShieldAlert, 
		Wrench, 
		Pill,
		Ambulance,
		Stethoscope,
		Users,
		FileText,
		Megaphone,
		AlertTriangle,
		Calendar,
		ChevronRight,
		Plus,
		Play,
		MapPin,
		Clock,
		Timer,
		Package,
		Mic,
		CheckCircle2,
		Car,
		Hospital,
		Navigation2,
		MoreVertical,
		ExternalLink,
	} from 'lucide-svelte';
	import { modeStore } from '$lib/stores/mode.svelte';

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
	const displayDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

	// Static data for the dashboard (Desktop mode)
	const activities = [
		{ time: '08:30', title: 'Formation secourisme - Équipe A', type: 'Formation', icon: Users },
		{ time: '10:00', title: 'Contrôle véhicule AMB-12', type: 'Maintenance', icon: Ambulance },
		{ time: '14:00', title: 'Réunion qualité mensuelle', type: 'Réunion', icon: Stethoscope },
	];

	const qualityReports = [
		{ title: 'Retard intervention Lausanne', date: 'Il y a 2h', severity: 'critical' as const, category: 'Intervention' },
		{ title: 'Matériel manquant AMB-08', date: 'Il y a 5h', severity: 'warning' as const, category: 'Équipement' },
		{ title: 'Suggestion amélioration formulaire', date: 'Hier', severity: 'info' as const, category: 'Suggestion' },
	];

	const criticalMedications = [
		{ name: 'Adrénaline 1mg/ml', quantity: 3, status: 'critical' },
		{ name: 'Atropine 0.5mg', quantity: 8, status: 'warning' },
		{ name: 'Morphine 10mg', quantity: 5, status: 'warning' },
		{ name: 'Midazolam 5mg', quantity: 2, status: 'critical' },
	];

	const logbookEntries = [
		{ 
			title: 'Incident véhicule AMB-03', 
			content: 'Pneu crevé lors de l\'intervention sur l\'A1. Véhicule de remplacement déployé. Intervention terminée avec succès.',
			timestamp: 'Aujourd\'hui, 07:45',
			author: 'M. Dupont'
		},
		{ 
			title: 'Changement d\'équipe', 
			content: 'Équipe de nuit relayée par équipe du matin. Passation effectuée sans incident particulier.',
			timestamp: 'Aujourd\'hui, 06:00',
			author: 'S. Martin'
		},
		{ 
			title: 'Stock médicaments contrôlé', 
			content: 'Inventaire complet effectué. Commande passée pour réapprovisionnement des articles en rupture.',
			timestamp: 'Hier, 18:30',
			author: 'L. Bernard'
		},
	];

	const shortcuts = [
		{ label: 'Ajouter un document', href: '/documents', icon: FileText, iconBgColor: 'bg-blue-100' },
		{ label: 'Créer une annonce', href: '/annonces', icon: Megaphone, iconBgColor: 'bg-purple-100' },
		{ label: 'Déclarer une panne', href: '/pannes', icon: AlertTriangle, iconBgColor: 'bg-amber-100' },
		{ label: 'Gérer les utilisateurs', href: '/utilisateurs', icon: Users, iconBgColor: 'bg-green-100' },
		{ label: 'Consulter équipements', href: '/equipement', icon: Wrench, iconBgColor: 'bg-orange-100' },
		{ label: 'Voir le planning', href: '/activites', icon: Calendar, iconBgColor: 'bg-pink-100' },
	];

	// Card definitions for the grid system
	const cards: CardDefinition[] = [
		// Desktop mode KPIs
		{ id: 'kpi-tasks', visibleModes: ['desktop'], component: kpiTasks },
		{ id: 'kpi-quality', visibleModes: ['desktop'], component: kpiQuality },
		{ id: 'kpi-equipment', visibleModes: ['desktop'], component: kpiEquipment },
		{ id: 'kpi-meds', visibleModes: ['desktop'], component: kpiMeds },
		// Desktop mode cards
		{ id: 'activities', visibleModes: ['desktop'], component: activitiesCard },
		{ id: 'quality-reports', visibleModes: ['desktop'], component: qualityReportsCard },
		{ id: 'stock', visibleModes: ['desktop'], component: stockCard },
		{ id: 'logbook', visibleModes: ['desktop'], component: logbookCard },
		{ id: 'shortcuts', visibleModes: ['desktop'], component: shortcutsCard },
		// Intervention mode cards
		{ id: 'intervention-current', visibleModes: ['intervention'], component: interventionCurrentCard },
		{ id: 'intervention-meds', visibleModes: ['intervention'], component: interventionMedsCard },
		{ id: 'intervention-equipment', visibleModes: ['intervention'], component: interventionEquipmentCard },
		{ id: 'intervention-quality', visibleModes: ['intervention'], component: interventionQualityCard },
	];
</script>

<!-- ========================================== -->
<!-- Card Snippets for Desktop Mode -->
<!-- ========================================== -->

{#snippet kpiTasks()}
	<KPICard 
		label="Tâches en attente" 
		value={12} 
		trend="+3 depuis hier" 
		trendDirection="up"
		icon={ClipboardCheck}
	/>
{/snippet}

{#snippet kpiQuality()}
	<KPICard 
		label="Signalements qualité" 
		value={7} 
		trend="-2 cette semaine" 
		trendDirection="down"
		icon={ShieldAlert}
	/>
{/snippet}

{#snippet kpiEquipment()}
	<KPICard 
		label="Équipements en panne" 
		value={3} 
		trend="1 critique" 
		trendDirection="neutral"
		icon={Wrench}
	/>
{/snippet}

{#snippet kpiMeds()}
	<KPICard 
		label="Médicaments critiques" 
		value={4} 
		trend="Péremption < 30j" 
		trendDirection="neutral"
		icon={Pill}
	/>
{/snippet}

{#snippet activitiesCard()}
	<DashboardCard>
		<div class="p-5 flex flex-col h-full">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-base font-bold text-gray-900">Activités aujourd'hui</h3>
				<a href="/activites" class="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
					Voir tout <ChevronRight size={14} />
				</a>
			</div>
			<div class="space-y-0">
				{#each activities as activity}
					<ActivityItem 
						time={activity.time}
						title={activity.title}
						type={activity.type}
						icon={activity.icon}
					/>
				{/each}
			</div>
		</div>
	</DashboardCard>
{/snippet}

{#snippet qualityReportsCard()}
	<DashboardCard>
		<div class="p-5 flex flex-col h-full">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-base font-bold text-gray-900">Signalements qualité</h3>
				<a href="/qualite" class="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
					Voir tout <ChevronRight size={14} />
				</a>
			</div>
			<div class="space-y-0 mb-6">
				{#each qualityReports as report}
					<QualityReportItem 
						title={report.title}
						date={report.date}
						severity={report.severity}
						category={report.category}
					/>
				{/each}
			</div>
			<Btn variant="secondary" size="sm" icon={Plus} class="mt-auto mb-0 self-start">
				Ajouter un signalement
			</Btn>
		</div>
	</DashboardCard>
{/snippet}

{#snippet stockCard()}
	<DashboardCard>
		<div class="p-5 flex flex-col h-full">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-base font-bold text-gray-900">Stock médicaments</h3>
				<a href="/medicaments" class="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
					Voir tout <ChevronRight size={14} />
				</a>
			</div>
			<div class="space-y-3 mb-6">
				{#each criticalMedications as med}
					<div class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
						<span class="text-sm text-gray-800 truncate flex-1">{med.name}</span>
						<div class="flex items-center gap-2 shrink-0">
							<span class="text-sm font-semibold text-gray-900">{med.quantity}</span>
							<span class="w-2 h-2 rounded-full {med.status === 'critical' ? 'bg-red-500' : 'bg-amber-500'}"></span>
						</div>
					</div>
				{/each}
			</div>
			<Btn variant="secondary" size="sm" icon={Plus} class="mt-auto mb-0 self-start">
				Commander des stocks
			</Btn>
		</div>
	</DashboardCard>
{/snippet}

{#snippet logbookCard()}
	<DashboardCard>
		<div class="p-5 flex flex-col h-full">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-base font-bold text-gray-900">Livre de bord — Entrées récentes</h3>
				<a href="/livre-de-bord" class="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
					Voir tout <ChevronRight size={14} />
				</a>
			</div>
			<div class="space-y-0 mb-6">
				{#each logbookEntries as entry}
					<LogbookEntry 
						title={entry.title}
						content={entry.content}
						timestamp={entry.timestamp}
						author={entry.author}
					/>
				{/each}
			</div>
			<Btn variant="secondary" size="sm" icon={Plus} class="mt-auto mb-0 self-start">
				Ajouter une entrée
			</Btn>
		</div>
	</DashboardCard>
{/snippet}

{#snippet shortcutsCard()}
	<DashboardCard>
		<div class="p-5 flex flex-col h-full">
			<h3 class="text-base font-bold text-gray-900 mb-4">Mes Raccourcis</h3>
			<div class="grid grid-cols-3 gap-2 mb-6">
				{#each shortcuts as shortcut}
					<ShortcutButton 
						label={shortcut.label}
						href={shortcut.href}
						icon={shortcut.icon}
						iconBgColor={shortcut.iconBgColor}
					/>
				{/each}
			</div>
			<Btn variant="secondary" size="sm" icon={Plus} class="mt-auto mb-0 self-start">
				Éditer les raccourcis
			</Btn>
		</div>
	</DashboardCard>
{/snippet}

<!-- ========================================== -->
<!-- Card Snippets for Intervention Mode -->
<!-- ========================================== -->

<!-- 1. Intervention en cours + Livre de bord -->
{#snippet interventionCurrentCard()}
	<DashboardCard>
		<div class="p-5 grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-6 h-full">
			<!-- Left column: Intervention info + Logbook -->
			<div class="flex flex-col">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-base font-bold text-gray-900">Intervention en cours</h3>
					<div class="flex items-center gap-2">
						<Timer size={16} class="text-primary-600" />
						<span class="text-sm font-mono font-bold text-primary-700">00:12:34</span>
					</div>
				</div>
				
				<!-- Active Intervention -->
				<div class="bg-primary-50 border border-primary-200 rounded-xl px-4 py-3 mb-4 hover:bg-primary-100 transition-colors cursor-pointer">
					<div class="flex items-center justify-between">
						<span class="text-sm font-mono font-bold text-primary-800">FIP-2025-08471</span>
						<Btn variant="secondary" size="md" icon={ExternalLink} class="justify-center px-2.5!">
							<span class="sr-only">Ouvrir</span>
						</Btn>
					</div>
					<p class="text-sm font-medium text-gray-900">Rue de Bourg 12, 1003 Lausanne</p>
				</div>

				<!-- Livre de bord - Recent entries -->
				<div class="border-t border-gray-200 pt-4 flex-1">
					<h4 class="text-sm font-semibold text-gray-700 mb-3">Livre de bord</h4>
					<div class="space-y-2">
						<div class="flex items-center gap-3">
							<div class="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
								<Navigation2 size={12} class="text-emerald-600" />
							</div>
							<div class="flex-1 min-w-0">
								<p class="text-xs font-medium text-gray-900">Départ base</p>
							</div>
							<span class="text-xs text-gray-500">08:45</span>
						</div>
						<div class="flex items-center gap-3">
							<div class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
								<MapPin size={12} class="text-blue-600" />
							</div>
							<div class="flex-1 min-w-0">
								<p class="text-xs font-medium text-gray-900">Arrivée sur place</p>
							</div>
							<span class="text-xs text-gray-500">08:58</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Right column: Quick actions -->
			<div class="xl:border-l xl:border-gray-200 xl:pl-6">
				<h4 class="text-sm font-semibold text-gray-700 mb-3">Entrées rapides</h4>
				<div class="grid grid-cols-2 gap-3">
					<button class="flex flex-col items-center justify-center p-3 xl:p-4 bg-emerald-100 hover:bg-emerald-200 border-2 border-emerald-300 rounded-xl transition-colors group">
						<Navigation2 size={24} class="text-emerald-700 mb-1 group-hover:scale-110 transition-transform" />
						<span class="font-semibold text-emerald-800">Départ</span>
					</button>
					<button class="flex flex-col items-center justify-center p-3 xl:p-4 bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 rounded-xl transition-colors group">
						<MapPin size={24} class="text-blue-700 mb-1 group-hover:scale-110 transition-transform" />
						<span class="font-semibold text-blue-800">Sur place</span>
					</button>
					<button class="flex flex-col items-center justify-center p-3 xl:p-4 bg-rose-100 hover:bg-rose-200 border-2 border-rose-300 rounded-xl transition-colors group">
						<Pill size={24} class="text-rose-700 mb-1 group-hover:scale-110 transition-transform" />
						<span class="font-semibold text-rose-800">Médicament</span>
					</button>
					<button class="flex flex-col items-center justify-center p-3 xl:p-4 bg-violet-100 hover:bg-violet-200 border-2 border-violet-300 rounded-xl transition-colors group">
						<Mic size={24} class="text-violet-700 mb-1 group-hover:scale-110 transition-transform" />
						<span class="font-semibold text-violet-800">Note</span>
					</button>
					<button class="flex flex-col items-center justify-center p-3 xl:p-4 bg-orange-100 hover:bg-orange-200 border-2 border-orange-300 rounded-xl transition-colors group">
						<Ambulance size={24} class="text-orange-700 mb-1 group-hover:scale-110 transition-transform" />
						<span class="font-semibold text-orange-800">Transport</span>
					</button>
					<button class="flex flex-col items-center justify-center p-3 xl:p-4 bg-cyan-100 hover:bg-cyan-200 border-2 border-cyan-300 rounded-xl transition-colors group">
						<Hospital size={24} class="text-cyan-700 mb-1 group-hover:scale-110 transition-transform" />
						<span class="font-semibold text-cyan-800">Hôpital</span>
					</button>
				</div>
			</div>
		</div>
	</DashboardCard>
{/snippet}

<!-- 2. Médicaments : stock & médicaments utilisés -->
{#snippet interventionMedsCard()}
	<DashboardCard>
		<div class="p-5 flex flex-col h-full">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-base font-bold text-gray-900">Médicaments</h3>
				<a href="/medicaments" class="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
					Voir tout <ChevronRight size={14} />
				</a>
			</div>

			<!-- Indicators -->
			<div class="grid grid-cols-2 gap-2 mb-4">
				<div class="bg-gray-50 rounded-lg p-2 text-center">
					<p class="text-lg font-bold text-gray-900">24</p>
					<p class="text-xs text-gray-500">En stock</p>
				</div>
				<div class="bg-red-50 rounded-lg p-2 text-center">
					<p class="text-lg font-bold text-red-600">2</p>
					<p class="text-xs text-red-600">Périmés</p>
				</div>
			</div>

			<!-- Alert zone -->
			<div class="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
				<p class="text-xs font-semibold text-amber-800 mb-1">⚠️ Stupéfiants à contrôler</p>
				<p class="text-xs text-amber-700">Morphine : écart détecté</p>
			</div>

			<!-- Quick actions -->
			<div class="flex flex-col gap-2 mt-auto">
				<Btn variant="secondary" size="sm" icon={Plus} class="w-full justify-center">
					Médicament utilisé
				</Btn>
				<div class="flex gap-2">
					<Btn variant="secondary" size="sm" icon={Package} class="flex-1 justify-center">
						Mouvement
					</Btn>
					<Btn variant="secondary" size="sm" icon={CheckCircle2} class="flex-1 justify-center">
						Contrôle
					</Btn>
				</div>
			</div>
		</div>
	</DashboardCard>
{/snippet}

<!-- 4. Matériel / Véhicule – État rapide -->
{#snippet interventionEquipmentCard()}
	<DashboardCard>
		<div class="p-5 flex flex-col h-full">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-base font-bold text-gray-900">Matériel / Véhicule</h3>
			</div>

			<!-- Status indicators -->
			<div class="space-y-3 mb-4">
				<div class="flex items-center justify-between">
					<span class="text-sm text-gray-700">Oxygène (O₂)</span>
					<div class="flex items-center gap-2">
						<div class="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
							<div class="w-3/4 h-full bg-emerald-500 rounded-full"></div>
						</div>
						<span class="text-xs font-semibold text-emerald-600">75%</span>
					</div>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm text-gray-700">Défibrillateur</span>
					<span class="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">OK</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm text-gray-700">Matériel critique</span>
					<span class="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">1 manquant</span>
				</div>
			</div>

			<!-- Alert -->
			<div class="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
				<p class="text-xs font-semibold text-amber-800">Maintenance prévue</p>
				<p class="text-xs text-amber-700">AMB-12 : contrôle dans 3 jours</p>
			</div>

			<!-- Actions -->
			<div class="flex flex-col gap-2 mt-auto">
				<Btn variant="secondary" size="sm" icon={AlertTriangle} class="w-full justify-center">
					Déclarer une panne
				</Btn>
				<Btn variant="secondary" size="sm" icon={CheckCircle2} class="w-full justify-center">
					Vérifier matériel critique
				</Btn>
			</div>
		</div>
	</DashboardCard>
{/snippet}

<!-- 3. Déclarer un signalement qualité -->
{#snippet interventionQualityCard()}
	<DashboardCard>
		<div class="p-5 flex flex-col h-full">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-base font-bold text-gray-900">Signalement qualité</h3>
				<span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">2 ouverts</span>
			</div>

			<!-- Quick categories -->
			<div class="space-y-2 mb-4">
				<button class="w-full flex items-center gap-3 p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors text-left">
					<AlertTriangle size={18} class="text-red-600 shrink-0" />
					<div>
						<p class="text-sm font-medium text-red-800">Incident</p>
						<p class="text-xs text-red-600">Erreur, événement indésirable</p>
					</div>
				</button>
				<button class="w-full flex items-center gap-3 p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors text-left">
					<ShieldAlert size={18} class="text-amber-600 shrink-0" />
					<div>
						<p class="text-sm font-medium text-amber-800">Sécurité patient</p>
						<p class="text-xs text-amber-600">Risque ou danger identifié</p>
					</div>
				</button>
				<button class="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors text-left">
					<Wrench size={18} class="text-blue-600 shrink-0" />
					<div>
						<p class="text-sm font-medium text-blue-800">Matériel / Procédure</p>
						<p class="text-xs text-blue-600">Dysfonctionnement, amélioration</p>
					</div>
				</button>
			</div>

			<!-- Dictation shortcut -->
			<Btn variant="secondary" size="sm" icon={Mic} class="w-full justify-center mt-auto">
				Dicter un signalement
			</Btn>
		</div>
	</DashboardCard>
{/snippet}

<svelte:head>
	<title>ARESA - Tableau de bord</title>
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
		<main class="flex-1 bg-gray-50 overflow-hidden">
			{#if modeStore.current !== 'intervention'}
				<Breadcrumb items={[{ label: 'Accueil'}]} />
				<PageTitle title="Tableau de bord" />
				<PageSubTitle>{displayDate}</PageSubTitle>
			{/if}

			<!-- Dashboard Content -->
			<div class="px-4 md:px-8 xl:px-20 pb-8" class:pt-6={modeStore.current === 'intervention'}>
				<DashboardGrid {cards} />
			</div>
		</main>
	</div>
</div>
