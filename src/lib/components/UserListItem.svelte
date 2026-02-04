<script lang="ts">
	import type { User, Responsabilite } from '$lib/types/user';

	interface Props {
		user: User;
	}

	let { user }: Props = $props();

	const roleLabels: Record<string, string> = {
		ad: 'Ambulancier Diplômé',
		ta: 'Technicien Ambulancier',
		etudiant: 'Étudiant'
	};

	const responsabiliteLabels: Record<string, string> = {
		qualite: 'Responsable Qualité',
		formation: 'Responsable Formation',
		logistique: 'Responsable Logistique',
		base: 'Responsable de Base',
		direction: 'Direction'
	};

	function getInitials(prenom: string, nom: string): string {
		return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
	}

	function formatResponsabilite(resp: Responsabilite): string {
		const label = responsabiliteLabels[resp.type];
		const scopeLabel = resp.scope === 'service' ? '' : ' (Base)';
		const adjointLabel = resp.adjoint ? ' (Adj.)' : '';
		return `+ ${label}${scopeLabel}${adjointLabel}`;
	}
</script>

<a
	href="/utilisateurs/{user.id}"
	class="flex items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
>
	<!-- Avatar -->
	<div
		class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 border-2 border-primary-200 flex items-center justify-center shrink-0"
	>
		<span class="text-sm font-semibold text-primary-700">
			{getInitials(user.prenom, user.nom)}
		</span>
	</div>

	<!-- Nom + Rôles -->
	<div class="flex-1 min-w-0">
		<p class="text-sm font-semibold text-gray-900">{user.prenom} {user.nom}</p>
		<p class="text-xs text-gray-500">{roleLabels[user.role_base]}</p>
		{#each user.responsabilites as resp}
			<p class="text-xs text-primary-600">{formatResponsabilite(resp)}</p>
		{/each}
		<!-- Email visible uniquement sur mobile -->
		<p class="text-xs text-gray-400 mt-1 md:hidden">{user.email}</p>
	</div>

	<!-- Téléphone (caché sur mobile) -->
	<div class="hidden md:block text-sm text-gray-600 shrink-0 w-36">
		{user.telephone}
	</div>

	<!-- Email (caché sur mobile) -->
	<div class="hidden md:block text-sm text-gray-600 shrink-0 w-48 truncate">
		{user.email}
	</div>
</a>
