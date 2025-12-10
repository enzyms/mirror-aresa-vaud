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
		Settings,
		Calendar,
		Clock,
		ChevronRight,
		Plus
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
			<PageTitle title="Tableau de bord" />

			<!-- Date -->
			<PageSubTitle>{displayDate}</PageSubTitle>

			<!-- Dashboard Content -->
			<div class="px-4 md:px-10 lg:px-20 flex flex-col gap-6 md:gap-8 pb-8">
				
				<!-- Row 1: KPI Cards -->
				<div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 md:gap-6">
					<KPICard 
						label="Tâches en attente" 
						value={12} 
						trend="+3 depuis hier" 
						trendDirection="up"
						icon={ClipboardCheck}
					/>
					<KPICard 
						label="Signalements qualité" 
						value={7} 
						trend="-2 cette semaine" 
						trendDirection="down"
						icon={ShieldAlert}
					/>
					<KPICard 
						label="Équipements en panne" 
						value={3} 
						trend="1 critique" 
						trendDirection="neutral"
						icon={Wrench}
					/>
					<KPICard 
						label="Médicaments critiques" 
						value={4} 
						trend="Péremption < 30j" 
						trendDirection="neutral"
						icon={Pill}
					/>
				</div>

				<!-- Row 2: Activity, Quality Reports, Medications -->
				<div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
					
					<!-- Today's Activities -->
					<DashboardCard class="h-auto">
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

					<!-- Quality Reports -->
					<DashboardCard class="h-auto">
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

					<!-- Critical Medications -->
					<DashboardCard class="h-auto">
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
				</div>

				<!-- Row 3: Logbook and Shortcuts -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
					
					<!-- Recent Logbook Entries -->
					<DashboardCard class="h-auto">
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

					<!-- Admin Shortcuts -->
					<DashboardCard class="h-auto">
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
				</div>

			</div>
		</main>
	</div>
</div>
