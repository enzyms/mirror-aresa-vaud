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
		Siren,
		MapPin,
		Phone
	} from 'lucide-svelte';

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

	// Static data for the dashboard
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
		{
			id: 'kpi-tasks',
			visibleModes: ['desktop'],
			component: kpiTasks
		},
		{
			id: 'kpi-quality',
			visibleModes: ['desktop'],
			component: kpiQuality
		},
		{
			id: 'kpi-equipment',
			visibleModes: ['desktop'],
			component: kpiEquipment
		},
		{
			id: 'kpi-meds',
			visibleModes: ['desktop'],
			component: kpiMeds
		},
		// Desktop mode cards
		{
			id: 'activities',
			visibleModes: ['desktop'],
			component: activitiesCard
		},
		{
			id: 'quality-reports',
			visibleModes: ['desktop'],
			component: qualityReportsCard
		},
		{
			id: 'stock',
			visibleModes: ['desktop'],
			component: stockCard
		},
		{
			id: 'logbook',
			visibleModes: ['desktop'],
			component: logbookCard
		},
		{
			id: 'shortcuts',
			visibleModes: ['desktop'],
			component: shortcutsCard
		},
		// Intervention mode KPIs
		{
			id: 'kpi-alerts',
			visibleModes: ['intervention'],
			component: kpiAlerts
		},
		{
			id: 'kpi-active-missions',
			visibleModes: ['intervention'],
			component: kpiActiveMissions
		},
		// Intervention mode cards
		{
			id: 'emergency-map',
			visibleModes: ['intervention'],
			component: emergencyMapCard
		},
		{
			id: 'quick-actions',
			visibleModes: ['intervention'],
			component: quickActionsCard
		},
		{
			id: 'active-interventions',
			visibleModes: ['intervention'],
			component: activeInterventionsCard
		}
	];
</script>

<!-- Card Snippets for Desktop Mode -->
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

<!-- Card Snippets for Intervention Mode -->
{#snippet kpiAlerts()}
	<KPICard 
		label="Alertes actives" 
		value={3} 
		trend="2 critiques" 
		trendDirection="up"
		icon={Siren}
		iconColor="text-red-600"
	/>
{/snippet}

{#snippet kpiActiveMissions()}
	<KPICard 
		label="Missions en cours" 
		value={5} 
		trend="2 en attente" 
		trendDirection="neutral"
		icon={Ambulance}
		iconColor="text-amber-600"
	/>
{/snippet}

{#snippet emergencyMapCard()}
	<DashboardCard class="h-auto min-h-[300px]">
		<div class="p-5 flex flex-col h-full">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-base font-bold text-gray-900">Carte des interventions</h3>
			</div>
			<div class="flex-1 bg-gray-100 rounded-lg flex items-center justify-center">
				<div class="text-center text-gray-500">
					<MapPin size={48} class="mx-auto mb-2 opacity-50" />
					<p class="text-sm">Carte interactive</p>
				</div>
			</div>
		</div>
	</DashboardCard>
{/snippet}

{#snippet quickActionsCard()}
	<DashboardCard>
		<div class="p-5 flex flex-col h-full">
			<h3 class="text-base font-bold text-gray-900 mb-4">Actions rapides</h3>
			<div class="flex flex-col gap-3">
				<Btn variant="primary" size="md" icon={Siren} class="w-full justify-center">
					Nouvelle intervention
				</Btn>
				<Btn variant="secondary" size="md" icon={Phone} class="w-full justify-center">
					Appeler la centrale
				</Btn>
				<Btn variant="secondary" size="md" icon={AlertTriangle} class="w-full justify-center">
					Signaler un incident
				</Btn>
			</div>
		</div>
	</DashboardCard>
{/snippet}

{#snippet activeInterventionsCard()}
	<DashboardCard>
		<div class="p-5 flex flex-col h-full">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-base font-bold text-gray-900">Interventions actives</h3>
			</div>
			<div class="space-y-3">
				<div class="p-3 bg-red-50 border border-red-200 rounded-lg">
					<div class="flex items-center justify-between mb-1">
						<span class="text-sm font-semibold text-red-800">INT-2024-0847</span>
						<span class="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">Urgent</span>
					</div>
					<p class="text-sm text-red-700">Accident route - Lausanne Centre</p>
					<p class="text-xs text-red-600 mt-1">AMB-12 • En route</p>
				</div>
				<div class="p-3 bg-amber-50 border border-amber-200 rounded-lg">
					<div class="flex items-center justify-between mb-1">
						<span class="text-sm font-semibold text-amber-800">INT-2024-0846</span>
						<span class="text-xs bg-amber-600 text-white px-2 py-0.5 rounded-full">En cours</span>
					</div>
					<p class="text-sm text-amber-700">Malaise domicile - Prilly</p>
					<p class="text-xs text-amber-600 mt-1">AMB-08 • Sur place</p>
				</div>
			</div>
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
			<PageTitle title="Tableau de bord" />

			<!-- Date -->
			<PageSubTitle>{displayDate}</PageSubTitle>

			<!-- Dashboard Content -->
			<div class="px-4 md:px-10 lg:px-20 pb-8">
				<DashboardGrid {cards} />
			</div>
		</main>
	</div>
</div>
