<script lang="ts">
	import AppShell from '$lib/components/AppShell.svelte';
	import DashboardCard from '$lib/components/DashboardCard.svelte';
	import Btn from '$lib/components/Btn.svelte';
	import {
		AlertTriangle,
		Clock,
		Package,
		ArrowDownToLine,
		ArrowUpFromLine,
		ArrowLeftRight,
		ClipboardCheck,
		History,
		Search,
		Filter,
		Lock,
		ChevronDown,
		Plus,
	} from 'lucide-svelte';

	// Mock data
	const emplacements = [
		{ id: '1', nom: 'ASCO 070', type: 'ambulance' },
		{ id: '2', nom: 'ASCO 072', type: 'ambulance' },
		{ id: '3', nom: 'Armoire centrale', type: 'armoire' },
	];

	let selectedEmplacement = $state(emplacements[0]);

	const alertes = [
		{ type: 'stock_bas', medicament: 'Adrénaline 1mg/ml', message: '2 restants (seuil: 5)', severity: 'warning' },
		{ type: 'peremption', medicament: 'Morphine 10mg', message: 'Lot #2345 expire dans 7 jours', severity: 'critical' },
	];

	const inventaire = [
		{ id: '1', nom: 'Adrénaline', dosage: '1mg/ml', quantite: 2, lot: '#2341', expiration: '06/2026', stupefiant: false, status: 'warning' },
		{ id: '2', nom: 'Morphine', dosage: '10mg', quantite: 4, lot: '#2508', expiration: '03/2027', stupefiant: true, status: 'ok' },
		{ id: '3', nom: 'Midazolam', dosage: '5mg/ml', quantite: 3, lot: '#3102', expiration: '08/2026', stupefiant: true, status: 'ok' },
		{ id: '4', nom: 'Paracétamol', dosage: '1g', quantite: 12, lot: '#1892', expiration: '12/2026', stupefiant: false, status: 'ok' },
		{ id: '5', nom: 'NaCl 0.9%', dosage: '500ml', quantite: 8, lot: '#3421', expiration: '08/2027', stupefiant: false, status: 'ok' },
		{ id: '6', nom: 'Atropine', dosage: '0.5mg', quantite: 6, lot: '#2891', expiration: '04/2026', stupefiant: false, status: 'warning' },
	];

	let searchQuery = $state('');

	const filteredInventaire = $derived(
		inventaire.filter(item =>
			item.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.dosage.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);
</script>

<svelte:head>
	<title>Stock Médicaments - ARESA</title>
</svelte:head>

<AppShell
	title="Stock Médicaments"
	subtitle="Gestion consolidée du stock par emplacement"
	breadcrumbs={[{ label: 'Stock médicaments' }]}
>
	{#snippet actions()}
		<Btn variant="primary" size="md" icon={Plus}>
			Nouveau mouvement
		</Btn>
	{/snippet}

	<div class="space-y-6">
		<!-- Alertes -->
		{#if alertes.length > 0}
			<DashboardCard>
				<div class="p-5">
					<h3 class="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
						<AlertTriangle size={18} class="text-amber-500" />
						Alertes ({alertes.length})
					</h3>
					<div class="space-y-3">
						{#each alertes as alerte}
							<div class="flex items-start gap-3 p-3 rounded-lg {alerte.severity === 'critical' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}">
								{#if alerte.type === 'stock_bas'}
									<Package size={18} class="{alerte.severity === 'critical' ? 'text-red-500' : 'text-amber-500'} mt-0.5" />
								{:else}
									<Clock size={18} class="{alerte.severity === 'critical' ? 'text-red-500' : 'text-amber-500'} mt-0.5" />
								{/if}
								<div>
									<p class="text-sm font-semibold {alerte.severity === 'critical' ? 'text-red-800' : 'text-amber-800'}">{alerte.medicament}</p>
									<p class="text-sm {alerte.severity === 'critical' ? 'text-red-700' : 'text-amber-700'}">{alerte.message}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</DashboardCard>
		{/if}

		<!-- Actions rapides -->
		<DashboardCard>
			<div class="p-5">
				<h3 class="text-base font-bold text-gray-900 mb-4">Actions rapides</h3>
				<div class="grid grid-cols-2 md:grid-cols-5 gap-3">
					<a href="/stock/controle" class="flex flex-col items-center gap-2 p-4 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors">
						<div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
							<ClipboardCheck size={20} class="text-primary-600" />
						</div>
						<span class="text-sm font-medium text-primary-700 text-center">Contrôle quotidien</span>
					</a>
					<a href="/stock/entree" class="flex flex-col items-center gap-2 p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
						<div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
							<ArrowDownToLine size={20} class="text-emerald-600" />
						</div>
						<span class="text-sm font-medium text-emerald-700 text-center">Entrée</span>
					</a>
					<a href="/stock/sortie" class="flex flex-col items-center gap-2 p-4 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors">
						<div class="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
							<ArrowUpFromLine size={20} class="text-rose-600" />
						</div>
						<span class="text-sm font-medium text-rose-700 text-center">Sortie</span>
					</a>
					<a href="/stock/transfert" class="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
						<div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
							<ArrowLeftRight size={20} class="text-blue-600" />
						</div>
						<span class="text-sm font-medium text-blue-700 text-center">Transfert</span>
					</a>
					<a href="/stock/historique" class="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
						<div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
							<History size={20} class="text-gray-600" />
						</div>
						<span class="text-sm font-medium text-gray-700 text-center">Historique</span>
					</a>
				</div>
			</div>
		</DashboardCard>

		<!-- Inventaire -->
		<DashboardCard>
			<div class="p-5">
				<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
					<h3 class="text-base font-bold text-gray-900">Inventaire</h3>

					<div class="flex items-center gap-3">
						<!-- Emplacement selector -->
						<div class="relative">
							<select
								bind:value={selectedEmplacement}
								class="appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							>
								{#each emplacements as emp}
									<option value={emp}>{emp.nom}</option>
								{/each}
							</select>
							<ChevronDown size={16} class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
						</div>

						<!-- Search -->
						<div class="relative">
							<Search size={16} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
							<input
								type="text"
								placeholder="Rechercher..."
								bind:value={searchQuery}
								class="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							/>
						</div>
					</div>
				</div>

				<!-- Table -->
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-gray-200">
								<th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Médicament</th>
								<th class="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantité</th>
								<th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lot</th>
								<th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiration</th>
								<th class="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-100">
							{#each filteredInventaire as item}
								<tr class="hover:bg-gray-50 transition-colors">
									<td class="py-3 px-4">
										<div class="flex items-center gap-2">
											{#if item.stupefiant}
												<Lock size={14} class="text-amber-500" />
											{/if}
											<div>
												<p class="text-sm font-medium text-gray-900">{item.nom}</p>
												<p class="text-xs text-gray-500">{item.dosage}</p>
											</div>
										</div>
									</td>
									<td class="py-3 px-4 text-center">
										<span class="inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded-full text-sm font-semibold {item.status === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}">
											{item.quantite}
										</span>
									</td>
									<td class="py-3 px-4">
										<span class="text-sm text-gray-600 font-mono">{item.lot}</span>
									</td>
									<td class="py-3 px-4">
										<span class="text-sm text-gray-600">{item.expiration}</span>
									</td>
									<td class="py-3 px-4 text-right">
										<button class="text-primary-600 hover:text-primary-700 text-sm font-medium">
											Mouvement
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Legend -->
				<div class="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
					<div class="flex items-center gap-1.5">
						<Lock size={12} class="text-amber-500" />
						<span>Stupéfiant (contrôle renforcé)</span>
					</div>
				</div>
			</div>
		</DashboardCard>
	</div>
</AppShell>
