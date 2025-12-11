<script lang="ts">
	import { Search, Bell, Menu, X, ChevronDown, User, History, Pill, GraduationCap, Shirt, Download, LogOut, Monitor, Siren, Plus, Check } from 'lucide-svelte';
	import Logo from './Logo.svelte';
	import { DropdownMenu } from 'bits-ui';
	import { modeStore, modes } from '$lib/stores/mode.svelte';

	interface Props {
		onMenuToggle?: () => void;
		isMobileMenuOpen?: boolean;
	}

	let { onMenuToggle, isMobileMenuOpen = false }: Props = $props();
</script>

<nav class="bg-white rounded-[28px] shadow-card px-4 md:px-7 py-3 flex items-center justify-between overflow-hidden">
	<!-- Logo -->
	<div class="flex items-center gap-2">
		<!-- Mobile menu toggle -->
		<button 
			class="lg:hidden p-2 -ml-2 text-gray-700 hover:text-primary-700 transition-colors"
			onclick={onMenuToggle}
			aria-label="Toggle menu"
		>
			{#if isMobileMenuOpen}
				<X size={24} />
			{:else}
				<Menu size={24} />
			{/if}
		</button>
		
		<Logo />
	</div>

	<!-- Search bar - hidden on mobile -->
	<div class="hidden md:flex items-center justify-between w-[400px] lg:w-[500px] h-12 border border-gray-200 focus-within:border-primary-200 focus-within:outline-solid focus-within:outline-primary-200 rounded-full pl-5 pr-3 py-0.5">
		<input 
			type="text" 
			placeholder="Rechercher"
			class="flex-1 text-sm text-gray-600 placeholder-gray-600 outline-none bg-transparent"
		/>
		<div class="w-7 h-7 flex items-center justify-center text-primary-700 bg-primary-50 rounded-full">
			<Search size={16} />
		</div>
	</div>

	<!-- User navigation -->
	<div class="flex items-center gap-3 md:gap-5">
		<!-- Mobile search button -->
		<button class="md:hidden p-2 text-gray-600 hover:text-primary-700 transition-colors">
			<Search size={20} />
		</button>
		
		<!-- Notification bell -->
		<div class="relative">
			<button class="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-primary-700 transition-colors">
				<Bell size={24} />
			</button>
			<!-- Notification badge -->
			<div class="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-error-600 rounded-full flex items-center justify-center">
				<span class="text-[10px] text-white font-medium">3</span>
			</div>
		</div>

		<!-- Divider - hidden on mobile -->
		<div class="hidden md:block w-px h-[38px] bg-gray-300"></div>

		<!-- Mode Dropdown -->
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class="flex items-center gap-2 px-3 md:px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full cursor-pointer transition-colors outline-none">
				{#if modeStore.current === 'desktop'}
					<Monitor size={16} class="text-primary-600" />
					<span class="text-sm font-medium text-gray-700">Bureau</span>
				{:else}
					<Siren size={16} class="text-primary-600" />
					<span class="text-sm font-medium text-gray-700">Intervention</span>
				{/if}
				<ChevronDown size={14} class="text-gray-500" />
			</DropdownMenu.Trigger>

			<DropdownMenu.Content 
				class="z-50 min-w-[200px] bg-white rounded-2xl shadow-lg border border-gray-100 py-2 mt-2 animate-in fade-in-0 zoom-in-95"
				sideOffset={8}
				align="center"
			>
				<DropdownMenu.Group>
					<DropdownMenu.GroupHeading class="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
						Mode actif
					</DropdownMenu.GroupHeading>
					
					<DropdownMenu.Item 
						class="flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 cursor-pointer outline-none transition-colors"
						onSelect={() => { modeStore.current = 'desktop'; }}
					>
						<div class="flex items-center gap-3">
							<Monitor size={16} />
							Bureau
						</div>
						{#if modeStore.current === 'desktop'}
							<Check size={16} class="text-primary-600" />
						{/if}
					</DropdownMenu.Item>

					<DropdownMenu.Item 
						class="flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 cursor-pointer outline-none transition-colors"
						onSelect={() => { modeStore.current = 'intervention'; }}
					>
						<div class="flex items-center gap-3">
							<Siren size={16} />
							Intervention
						</div>
						{#if modeStore.current === 'intervention'}
							<Check size={16} class="text-primary-600" />
						{/if}
					</DropdownMenu.Item>
				</DropdownMenu.Group>

				<DropdownMenu.Separator class="my-2 h-px bg-gray-100" />

				<DropdownMenu.Item class="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-600 hover:bg-primary-50 cursor-pointer outline-none transition-colors font-medium">
					<Plus size={16} />
					Ajouter un nouveau mode
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>

		<!-- User info with dropdown -->
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity outline-none">
				<!-- Avatar -->
				<div class="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center border-2 border-primary-200">
					<span class="text-primary-700 font-semibold text-sm md:text-base">SF</span>
				</div>
				<!-- User details - hidden on mobile -->
				<div class="hidden md:flex flex-col text-left">
					<span class="text-sm text-gray-950 leading-tight">Stéphane Fuchs</span>
					<span class="text-sm text-gray-700 leading-tight">Administrateur</span>
				</div>
				<ChevronDown size={16} class="hidden md:block text-gray-500" />
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content 
					class="z-50 min-w-[280px] bg-white rounded-2xl shadow-lg border border-gray-100 py-2 mt-2 animate-in fade-in-0 zoom-in-95"
					sideOffset={8}
					align="end"
				>
					<!-- User header -->
					<div class="px-4 py-3 border-b border-gray-100">
						<p class="text-sm font-medium text-gray-900">Stéphane Fuchs</p>
						<p class="text-xs text-gray-500">stephane.fuchs@ams.ch</p>
					</div>

					<!-- Mes données -->
					<DropdownMenu.Group>
						<DropdownMenu.GroupHeading class="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
							Mes données
						</DropdownMenu.GroupHeading>	
						<DropdownMenu.Item class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 cursor-pointer outline-none transition-colors">
							<Pill size={16} />
							Utilisation de médicaments
						</DropdownMenu.Item>
						<DropdownMenu.Item class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 cursor-pointer outline-none transition-colors">
							<Shirt size={16} />
							Mes équipements
						</DropdownMenu.Item>
						<DropdownMenu.Item class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 cursor-pointer outline-none transition-colors">
							<GraduationCap size={16} />
							Mes formations
						</DropdownMenu.Item>
						<DropdownMenu.Item class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 cursor-pointer outline-none transition-colors">
							<History size={16} />
							Historique d'accès
						</DropdownMenu.Item>
						<DropdownMenu.Item class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 cursor-pointer outline-none transition-colors">
							<History size={16} />
							Exporter mes données
						</DropdownMenu.Item>
					</DropdownMenu.Group>

					<DropdownMenu.Separator class="my-1 h-px bg-gray-100" />

					<!-- Médicaments -->
					<DropdownMenu.Group>
						<DropdownMenu.GroupHeading class="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
							Mon profil
						</DropdownMenu.GroupHeading>
						<DropdownMenu.Item class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 cursor-pointer outline-none transition-colors">
							<User size={16} />
							Informations personnelles
						</DropdownMenu.Item>
						<DropdownMenu.Item class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 cursor-pointer outline-none transition-colors">
							<User size={16} />
							Settings
						</DropdownMenu.Item>
						
					</DropdownMenu.Group>


					<DropdownMenu.Separator class="my-1 h-px bg-gray-100" />

					<!-- Déconnexion -->
					<DropdownMenu.Item class="flex items-center gap-3 px-4 py-2 text-sm text-error-600 hover:bg-error-50 cursor-pointer outline-none transition-colors">
						<LogOut size={16} />
						Déconnexion
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	</div>
</nav>

