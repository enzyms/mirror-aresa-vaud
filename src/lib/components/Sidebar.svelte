<script lang="ts">
	import { page } from '$app/stores';
	import {
		Megaphone,
		Package,
		ShieldAlert,
		AlertTriangle,
		ClipboardCheck,
		GraduationCap,
		FileText,
		LayoutDashboard,
		ChartLine,
		Users,
		Settings,
	} from 'lucide-svelte';
	import type { ComponentType } from 'svelte';

	interface MenuItem {
		icon: ComponentType;
		label: string;
		href: string;
		badge?: number | string;
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
			title: 'Navigation',
			items: [
				{ icon: LayoutDashboard, label: 'Tableau de bord', href: '/' },
				{ icon: Megaphone, label: 'Annonces', href: '/annonces', badge: 3 },
				{ icon: Package, label: 'Stock médicaments', href: '/stock' },
				{ icon: ShieldAlert, label: 'Signalements', href: '/signalements', badge: 7 },
				{ icon: AlertTriangle, label: 'Pannes', href: '/pannes', badge: 2 },
				{ icon: ClipboardCheck, label: 'Tâches', href: '/taches' },
				{ icon: GraduationCap, label: 'Étudiants', href: '/etudiants' },
				{ icon: FileText, label: 'Documents', href: '/documents' },
			]
		},
		{
			title: 'Administration',
			items: [
				{ icon: ChartLine, label: 'Statistiques', href: '/statistiques' },
				{ icon: Users, label: 'Utilisateurs', href: '/utilisateurs' },
				{ icon: Settings, label: 'Configuration', href: '/configuration' },
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
	class="md:my-6 fixed lg:relative z-50 lg:z-auto h-full w-[280px] bg-primary-50 rounded-xl shadow-card px-4 py-6 flex flex-col transition-transform duration-300 ease-in-out overflow-y-auto {isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}"
>
	<nav class="flex flex-col gap-6">
		{#each menuCategories as category}
			<div class="flex flex-col gap-0.5">
				<h3 class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{category.title}</h3>
				{#each category.items as item}
					<a
						href={item.href}
						class="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl transition-colors {isActive(item.href) ? 'bg-primary-600 text-white hover:bg-primary-700' : 'text-primary-700 hover:bg-primary-100'}"
						onclick={() => onClose?.()}
					>
						<div class="flex items-center gap-3">
							<item.icon size={18} />
							<span class="text-sm font-medium">{item.label}</span>
						</div>
						{#if item.badge}
							<span class="min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold flex items-center justify-center {isActive(item.href) ? 'bg-white/20 text-white' : 'bg-primary-200 text-primary-700'}">
								{item.badge}
							</span>
						{/if}
					</a>
				{/each}
			</div>
		{/each}
	</nav>
</aside>
