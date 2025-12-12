<script lang="ts">
	import { page } from '$app/stores';
	import { 
		CalendarCheck,
		ClipboardCheck,
		BookOpen,
		Megaphone,
		Database,
		UserCircle,
		ShieldAlert,
		AlertTriangle,
		GraduationCap,
		Pill,
		FileText,
		LayoutDashboard,
		ChartLine,
		Users,
    ContactRound,
		Wrench,
	} from 'lucide-svelte';
	import type { ComponentType } from 'svelte';

	interface MenuItem {
		icon: ComponentType;
		label: string;
		href: string;
	}

	interface MenuCategory {
		title: string;
		items: MenuItem[];
	}

	interface Props {
		isOpen?: boolean;
		onClose?: () => void;
	}

	let { isOpen = true, onClose }: Props = $props();

	const menuCategories: MenuCategory[] = [
		{
			title: 'Mon espace',
			items: [
				{ icon: LayoutDashboard, label: 'Tableau de bord', href: '/' },
				{ icon: CalendarCheck, label: 'Activités programmées', href: '/activites' },
				{ icon: ClipboardCheck, label: 'Tâches à valider', href: '/taches' },
				{ icon: BookOpen, label: 'Livre de bord', href: '/livre-de-bord' },
				{ icon: Megaphone, label: 'Annonces', href: '/annonces' },
				{ icon: ShieldAlert, label: 'Signalements qualité', href: '/qualite' },
				{ icon: AlertTriangle, label: 'Pannes', href: '/pannes' },
				{ icon: GraduationCap, label: 'Étudiants', href: '/etudiants' },
			]
		},
		{
			title: 'Référentiels',
			items: [
				{ icon: ContactRound, label: 'Personnes', href: '/contacts' },
				{ icon: FileText, label: 'Documents', href: '/documents' },
				{ icon: Pill, label: 'Médicaments', href: '/medicaments' },
				{ icon: Wrench, label: 'Équipement technique', href: '/equipement' },
			]
		},
		{
			title: 'Administration',
			items: [
				{ icon: ChartLine, label: 'Statistiques', href: '/statistiques' },
				{ icon: Users, label: 'Utilisateurs & rôles', href: '/utilisateurs' },
			]
		}
	];

	// Check if current path matches menu item
	function isActive(href: string): boolean {
		const currentPath = $page.url.pathname;
		if (href === '/') {
			return currentPath === '/';
		}
		return currentPath.startsWith(href);
	}
</script>

<!-- Mobile overlay - only shown on mobile when menu is open -->
{#if isOpen && onClose}
	<button 
		class="lg:hidden fixed inset-0 bg-black/30 z-40"
		onclick={onClose}
		aria-label="Close menu"
	></button>
{/if}

<!-- Sidebar -->
<aside 
	class="md:my-6 fixed lg:relative z-50 lg:z-auto h-full w-[300px] bg-primary-50 rounded-xl shadow-card px-4 py-6 flex flex-col transition-transform duration-300 ease-in-out overflow-y-auto {isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}"
>
	<nav class="flex flex-col gap-8">
		{#each menuCategories as category}
			<div class="flex flex-col gap-0.5">
				<h3 class="px-4 py-2 text-xs font-semibold text-grey-400 uppercase tracking-wider">{category.title}</h3>
				{#each category.items as item}
					<a 
						href={item.href}
						class="flex items-center gap-3 px-4 py-2 rounded-full transition-colors {isActive(item.href) ? 'bg-primary-600 text-white hover:bg-primary-700' : 'text-primary-700 hover:bg-primary-100'}"
					>
						<item.icon size={16} />
						<span class="text-xs uppercase tracking-wide">{item.label}</span>
					</a>
				{/each}
			</div>
		{/each}
	</nav>
</aside>
